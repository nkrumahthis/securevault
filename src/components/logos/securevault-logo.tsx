import { motion } from "framer-motion";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center space-x-2 font-sans">
            <motion.div
                className="w-8 h-8 rounded-lg bg-purple-600 text-white text-lg font-bold flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                SV
            </motion.div>
            <span className="text-xl font-semibold text-gray-900">SecureVault</span>
        </Link>
    )
}