'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function TopNavigation() {
  return (
    <motion.nav
      className="py-2 px-6 flex justify-between items-center border-b-[0.5px] border-slate-400"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link href="/" className="flex items-center space-x-2">
        <motion.div
          className="w-8 h-8 rounded-lg bg-purple-600 text-white text-lg font-bold flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SV
        </motion.div>
        <span className="text-xl font-semibold text-gray-900">SecureVault</span>
      </Link>
      <div className="hidden md:flex space-x-6">
        <Link href="#features" className="text-gray-600 hover:text-purple-600 transition-colors">
          Features
        </Link>
        <Link href="#pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
          Pricing
        </Link>
        <Link href="#faq" className="text-gray-600 hover:text-purple-600 transition-colors">
          FAQ
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="hidden md:inline-flex">
          Log in
        </Button>
        <Button>Get Started</Button>
      </div>
    </motion.nav>
  )
}