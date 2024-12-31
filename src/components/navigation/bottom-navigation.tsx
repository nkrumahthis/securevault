'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BsFillLightningChargeFill, BsGithub, BsLinkedin, BsTwitterX } from 'react-icons/bs'

const navItems = [
  { icon: BsGithub, label: 'GitHub', href: 'https://github.com/kkopoku' },
  { icon: BsTwitterX, label: 'Twitter', href: 'https://twitter.com/kk_opoku' },
  { icon: BsLinkedin, label: 'Buy me a coffee', href: 'https://linkedin.com/in/k0ranteng' },
]

export function BottomNavigation() {
  const [isVisible, setIsVisible] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (currentScrollY + windowHeight >= documentHeight - 10) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={isVisible ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-50"
    >
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <motion.p className="text-sm text-gray-600">
            <span className="flex items-center">
                <BsFillLightningChargeFill className="w-5 h-5 text-xs mr-1 text-white bg-purple-600 rounded-full p-[4px]" />
                Open-source project by <a href="https://k0ranteng.com" className="font-semibold hover:underline hover:text-purple-600 transition-all">&nbsp;Koranteng</a>
            </span>
        </motion.p>
        <nav>
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="sr-only">{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.footer>
  )
}