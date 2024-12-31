'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { FaRegCopy } from 'react-icons/fa'

interface IViewMessageProps {
    setPageState: React.Dispatch<React.SetStateAction<string>>
    link: string
}

export function ViewMessage({ setPageState, link }: IViewMessageProps) {
  const [secureText, setSecureText] = useState('')
  const [passphrase, setPassphrase] = useState('')
  const [loading, setLoading] = useState(true)
  const [pageStatus, setPageStatus] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const API = process.env.NEXT_PUBLIC_API_URL

  async function checkPageState() {
    const id = link.split('/').pop()
    const getLinkUrl = new URL(`${API}/api/v1/link/getLinkDetails`)
    getLinkUrl.searchParams.append('id', String(id))

    try {
      setLoading(true)
      let response = await fetch(getLinkUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 404) {
        setPageStatus('NotFound')
      } else if (response.status === 401) {
        setPageStatus('Unauthorized')
      } else if (response.status === 200) {
        setPageStatus('MessageReceived')
        const data = await response.json()
        setSecureText(data.message)
      } else {
        setPageStatus('UnexpectedError')
      }
    } catch (e) {
      setPageStatus('UnexpectedError')
      console.error(`Error: ${e}`)
    } finally {
      setLoading(false)
    }
  }

  async function submitPassphrase() {
    if (!passphrase) {
      setErrorMessage('Please enter a passphrase')
      return toast('Passphrase is required', { icon: '🚫' })
    }

    const id = link.split('/').pop()
    const getLinkUrl = new URL(`${API}/api/v1/link/getLinkDetails`)
    getLinkUrl.searchParams.append('id', String(id))
    getLinkUrl.searchParams.append('passphrase', passphrase)

    try {
      setLoading(true)
      let response = await fetch(getLinkUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 401) {
        toast.error('Incorrect passphrase')
        setErrorMessage('Incorrect passphrase, please try again')
      } else if (response.status === 200) {
        const data = await response.json()
        toast.success('Message retrieved 😉')
        setPageStatus('MessageReceived')
        setSecureText(data.message)
      } else {
        setErrorMessage('Something went wrong, kindly try again later')
        toast.error('An error occurred please try again')
      }
    } catch (e) {
      toast.error('An error occurred please try again')
      setErrorMessage('Something went wrong, kindly try again later')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkPageState()
  }, [])

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-64"
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {pageStatus === 'Unauthorized' && 'Enter Passphrase'}
            {pageStatus === 'MessageReceived' && 'Secret Message'}
            {pageStatus === 'NotFound' && 'Message Not Found'}
            {pageStatus === 'UnexpectedError' && 'Error'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pageStatus === 'Unauthorized' && (
            <form onSubmit={(e) => { e.preventDefault(); submitPassphrase(); }} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter passphrase"
                value={passphrase}
                onChange={(e) => {
                  setPassphrase(e.target.value)
                  setErrorMessage('')
                }}
              />
              <Button type="submit" className="w-full">View Message</Button>
              {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            </form>
          )}

          {pageStatus=== 'MessageReceived' && (
            <div className="space-y-4">
              <Textarea
                value={secureText}
                readOnly
                className="min-h-[150px] bg-gray-100"
              />
              <div className="flex justify-between">
                <Button onClick={() => setPageState('Normal')}>Create New Message</Button>
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(secureText)
                    toast.success('Message copied to clipboard')
                  }}
                  className="flex items-center gap-2"
                >
                  <FaRegCopy /> Copy
                </Button>
              </div>
            </div>
          )}

          {pageStatus === 'NotFound' && (
            <div className="text-center space-y-4">
              <p>The message you're looking for doesn't exist or has been deleted.</p>
              <Button onClick={() => setPageState('Normal')}>Create New Message</Button>
            </div>
          )}

          {pageStatus === 'UnexpectedError' && (
            <div className="text-center space-y-4">
              <p>An unexpected error occurred. Please try again later.</p>
              <Button onClick={() => setPageState('Normal')}>Go Back</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

