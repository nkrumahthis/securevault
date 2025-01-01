'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Clock, Eye, Mail, Lock, KeyRound } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Toaster, toast } from 'react-hot-toast'
import { FaRegCopy } from 'react-icons/fa'
import { IoMdRefresh } from 'react-icons/io'

export function SecureVaultForm() {
  const [secureText, setSecureText] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [lifetime, setLifetime] = useState('3600000') // 1 hour in milliseconds
  const [viewNumber, setViewNumber] = useState('1')
  const [recipient, setRecipient] = useState('')
  const [loading, setLoading] = useState(false)
  const [linkGenerated, setLinkGenerated] = useState("")

  const API = process.env.NEXT_PUBLIC_API_URL

  function goToInitialPage() {
    window.location.pathname = "/";
    setSecureText("");
    setPassphrase("");
    setLifetime('3600000');
    setViewNumber("1");
  }

  function copyLink() {
    navigator.clipboard.writeText(linkGenerated);
    toast.success('Link copied to clipboard');
  }


  async function createLink() {

    if (linkGenerated) {
      goToInitialPage();
      setLinkGenerated("");
      return
    }

    if (!secureText) return toast.error('Please enter a message')

    if (recipient) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(recipient)) return toast.error('Please enter a valid email address')
    }

    const data = {
      message: secureText,
      lifetime: parseInt(lifetime),
      viewNumber: parseInt(viewNumber),
      passphrase: passphrase || null,
      recipient: recipient || null,
    }

    setLoading(true)
    const toastId = toast.loading('Creating link')

    try {
      const response = await fetch(`${API}/api/v1/link/createLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Link created', { id: toastId })
        setLinkGenerated(result.link.link)
      } else {
        throw new Error(result.message || 'Failed to create link')
      }
    } catch (error) {
      toast.error('An error occurred, please try again later', { id: toastId })
      console.error('Error:', error)
    }

    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex items-center justify-center px-4"
    >
      <Toaster />
      <Card className="w-full max-w-6xl shadow-lg">

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="w-5 h-5 text-purple-600" />
            Create Secure Message
          </CardTitle>

          <CardDescription className="text-gray-500">
            Your message will be encrypted and accessible only through a secure link
          </CardDescription>
        </CardHeader>

        <CardContent className="grid md:grid-cols-3 gap-6">

          <div className="flex flex-col md:col-span-2 space-y-2">
            <Label htmlFor="content">Secret Content</Label>
            <Textarea
              id="content"
              placeholder="Type your sensitive information here..."
              className="relative h-full resize-none"
              value={secureText}
              onChange={(e) => setSecureText(e.target.value)}
              disabled={linkGenerated.length > 0}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <KeyRound className="w-4 h-4 text-purple-600" />
              Privacy Options
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passphrase" className="text-sm">
                  Passphrase (Optional)
                </Label>
                <div className="relative">
                  <Input
                    id="passphrase"
                    type="password"
                    placeholder="Add an extra layer of security"
                    className="pr-10"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    disabled={linkGenerated.length > 0}
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lifetime" className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Lifetime
                </Label>
                <Select value={lifetime} onValueChange={setLifetime} disabled={linkGenerated.length > 0}>
                  <SelectTrigger id="lifetime">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300000">5 minutes</SelectItem>
                    <SelectItem value="1200000">20 minutes</SelectItem>
                    <SelectItem value="1800000">30 minutes</SelectItem>
                    <SelectItem value="3600000">1 hour</SelectItem>
                    <SelectItem value="86400000">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="views" className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  View Limit
                </Label>
                <Select value={viewNumber} onValueChange={setViewNumber} disabled={linkGenerated.length > 0}>
                  <SelectTrigger id="views">
                    <SelectValue placeholder="Select views" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 view</SelectItem>
                    <SelectItem value="2">2 views</SelectItem>
                    <SelectItem value="3">3 views</SelectItem>
                    <SelectItem value="4">4 views</SelectItem>
                    <SelectItem value="5">5 views</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  Recipient Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="We'll notify them when the link is ready"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={linkGenerated.length > 0}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">

          {linkGenerated.length < 1 && <Button
            className="min-w-80 bg-purple-600 hover:bg-purple-700"
            size="lg"
            onClick={createLink}
            disabled={loading}
          >
            {loading ? 'Creating...' : (linkGenerated.length > 0) ? 'Generate New Link' : 'Create Secure Link'}
          </Button>}

          {(linkGenerated.length > 0) && 
          <div className='flex flex-row gap-2'>
            <Button
              className="min-w-80 bg-purple-600 hover:bg-purple-700"
              size="lg"
              onClick={copyLink}
            >
              {linkGenerated}
            </Button>
            <button className="flex items-center justify-center bg-slate-100 hover:bg-slate-300 rounded-md px-2" 
              onClick={copyLink}>
              <FaRegCopy />
            </button>
            <button className="flex items-center justify-center bg-slate-100 hover:bg-slate-300 rounded-md px-2" 
              onClick={goToInitialPage}>
              <IoMdRefresh />
            </button>
          </div>}
          <p className="text-xs text-gray-500 text-center">
            Note: The secure link will only work for the specified number of views and will be permanently deleted afterward.
          </p>
        </CardFooter>

      </Card>
    </motion.div>
  )
}

