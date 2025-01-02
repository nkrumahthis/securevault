'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <motion.div
      className="text-center space-y-2 my-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
        Securely Share Data &nbsp;<span className="block text-purple-600">Effortlessly</span>
      </h1>
      <p className="mx-auto max-w-2xl text-xs text-gray-600">Securely share sensitive information with encrypted, self-destructing messages.</p>
    </motion.div>
  )
}

