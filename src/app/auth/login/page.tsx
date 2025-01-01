'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Mail, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AnimatedBackground } from '@/components/background/animated-background'
import { TopNavigation } from '@/components/navigation/top-navigation'
import { BottomNavigation } from '@/components/navigation/bottom-navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Implement login logic here
    console.log('Login attempt with:', { email, password })
    setLoading(false)
  }

  return (
    <main className="min-h-screen relative font-sans tracking-tighter">
      <AnimatedBackground />
      <div className="relative z-10">
        <TopNavigation />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex items-center justify-center px-4 py-20"
        >
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                <Shield className="w-6 h-6 text-purple-600" />
                Login to SecureVault
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="text-purple-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
        <BottomNavigation />
      </div>
    </main>
  )
}

