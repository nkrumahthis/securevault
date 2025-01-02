'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  initialMessage: string
  onSave: (message: string) => void
  viewing?: boolean
}

export function MessageModal({ isOpen, onClose, initialMessage, onSave, viewing = false }: MessageModalProps) {
  const [message, setMessage] = useState(initialMessage)

  useEffect(() => {
    setMessage(initialMessage)
  }, [initialMessage])

  const handleSave = () => {
    onSave(message)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{viewing ? `View Message` : `Edit Message`}</DialogTitle>
        </DialogHeader>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="text-sm lg:text-base min-h-[70vh]"
          placeholder="Type your sensitive information here..."
          disabled={viewing}
        />
        <DialogFooter className='gap-y-2'>
          {!viewing && <Button className='bg-purple-600 hover:bg-purple-700' onClick={handleSave}>Save</Button>}

          <div className='flex flex-row w-full gap-2 md:gap-3'>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            {viewing && <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                navigator.clipboard.writeText(message);
                toast.success('Message copied to clipboard');
              }}
            >
              copy
            </Button>}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

