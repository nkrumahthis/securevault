'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Zap, Trash2 } from 'lucide-react'

const features = [
  { icon: Shield, title: 'End-to-end Encryption', color: 'text-green-500' },
  { icon: Lock, title: 'Zero Knowledge', color: 'text-blue-500' },
  { icon: Zap, title: 'Auto-destruct', color: 'text-yellow-500' },
  { icon: Trash2, title: 'No Traces Left', color: 'text-red-500' },
]

export function TrustBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-20 px-4"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center text-lg text-gray-600 mb-8 font-semibold"
      >
        Enterprise-grade security features
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center hover:shadow-xl transition-shadow duration-300"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, delay: 0.2 * index }}
              className={`mb-4 p-3 rounded-full ${feature.color} bg-opacity-10`}
            >
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600">
              {getFeatureDescription(feature.title)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function getFeatureDescription(title: string): string {
  switch (title) {
    case 'End-to-end Encryption':
      return 'Your data is encrypted from the moment you hit send until it reaches the recipient.'
    case 'Zero Knowledge':
      return 'We have no access to your data. Only you and your intended recipient can decrypt the message.'
    case 'Auto-destruct':
      return 'Messages are automatically deleted after they\'ve been viewed or when they expire.'
    case 'No Traces Left':
      return 'Once deleted, your data is gone forever. We leave no traces on our servers.'
    default:
      return ''
  }
}