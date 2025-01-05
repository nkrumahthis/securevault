import Link from "@/models/link.model";
import { generateRandomString } from "@/lib/utils";
import sendEmail from "@/lib/email";
import { runTest, encryptWithBaseKey, encryptWithUserPassphrase, decryptWithBaseKey, decryptWithUserPassphrase } from "@/lib/encryption";
import dbConnect from "@/lib/connect";

export const POST = async (req: Request) => {    
    const body = await req.json();
    const { message, viewNumber, lifetime, passphrase, recipient } = body;
    const baseURL = process.env.SECUREVAULT_WEB;
    const rand = generateRandomString(4);

    // Validate inputs
    if (!message || !viewNumber || !lifetime) {
        return new Response(
            JSON.stringify({ message: "Please fill in all required fields" }),
            { status: 400 }
        );
    }

    let encryptedMessage = "";
    if (passphrase) {
        encryptedMessage = encryptWithUserPassphrase(message, passphrase);
    } else {
        encryptedMessage = encryptWithBaseKey(message);
    }

    try {
        await dbConnect()

        const link = await Link.create({
            message: encryptedMessage,
            viewNumber: viewNumber,
            lifetime: lifetime,
            my_id: rand,
            link: `${baseURL}${rand}`,
            passphrase: passphrase ?? null,
        });

        if (recipient) {
            console.log("It is getting here!");
            const emailMessage = `SECUREVAULT ALERTS\nA secure message has been sent to you. Kindly click the link below to access your secure message:\nLink: ${link.link}\nPassword: ${passphrase ? passphrase : "n/a"}`;
            try {
                await sendEmail(recipient, "SecureVault Alert", emailMessage);
                console.log("Email sent successfully");
            } catch (emailError) {
                console.error("Failed to send email:", emailError);
            }
        }

        return new Response(
            JSON.stringify({ message: "Link created successfully", link }),
            { status: 201 }
        );
    } catch (e) {
        console.log((e as Error).message);
        return new Response(
            JSON.stringify({ message: "Something went wrong while processing the request" }),
            { status: 500 }
        );
    }
};

export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const passphrase = url.searchParams.get('passphrase');

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Please provide an id" }),
                { status: 400 }
            );
        }

        await dbConnect()

        const foundLink = await Link.findOne({ my_id: id });

        if (!foundLink || foundLink.expires_at < Date.now()) {
            if (foundLink) await foundLink.deleteOne();
            return new Response(
                JSON.stringify({ message: "Link not found" }),
                { status: 404 }
            );
        }

        if (foundLink.passphrase) {
            if (!passphrase) {
                return new Response(
                    JSON.stringify({ message: "Please provide a passphrase" }),
                    { status: 401 }
                );
            } else {
                const isMatch = await foundLink.comparePassphrase(passphrase);
                if (!isMatch) {
                    return new Response(
                        JSON.stringify({ message: "Incorrect passphrase" }),
                        { status: 401 }
                    );
                }
            }
        }

        if (foundLink.viewNumber >= 2) {
            foundLink.viewNumber--;
            await foundLink.save();
        } else {
            await foundLink.deleteOne();
        }

        let decryptedMessage = foundLink.passphrase ?
            decryptWithUserPassphrase(foundLink.message, passphrase!)
            : decryptWithBaseKey(foundLink.message);

        return new Response(
            JSON.stringify({ message: decryptedMessage }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in getLinkDetails:", error);
        return new Response(
            JSON.stringify({ message: "An error occurred while fetching link details" }),
            { status: 500 }
        );
    }
};

export const testing = async () => {
    console.log("It is getting here!");
    let result = runTest();
    return new Response(
        JSON.stringify({ message: "Testing route", result }),
        { status: 200 }
    );
};