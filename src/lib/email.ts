import nodemailer from "nodemailer"

const sendEmail = async (recipient:string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: recipient,
    subject: subject,
    text: message,
  };

  async function main() {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  }

  await main().catch(error=>{
    console.log("Error: %s", error)
  });
};

export default sendEmail;