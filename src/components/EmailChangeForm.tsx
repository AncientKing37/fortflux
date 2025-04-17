import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'sonner'
import { supabase } from '@/integrations/supabase/client'

export default function EmailChangeForm() {
  const [newEmail, setNewEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [currentEmail, setCurrentEmail] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendCode = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.functions.invoke('send-email-change-code', {
        body: { currentEmail, newEmail }
      })

      if (error) throw error

      setIsCodeSent(true)
      toast.success('Verification code sent to your current email')
    } catch (error) {
      toast.error(error.message || 'Failed to send verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.functions.invoke('verify-email-change', {
        body: { currentEmail, newEmail, code: verificationCode }
      })

      if (error) throw error

      toast.success('Email changed successfully')
      setNewEmail('')
      setVerificationCode('')
      setIsCodeSent(false)
    } catch (error) {
      toast.error(error.message || 'Failed to verify code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Change Email</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Current Email</label>
          <Input
            type="email"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            placeholder="Enter your current email"
            disabled={isCodeSent}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">New Email</label>
          <Input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter your new email"
            disabled={isCodeSent}
          />
        </div>

        {!isCodeSent ? (
          <Button
            onClick={handleSendCode}
            disabled={isLoading || !currentEmail || !newEmail}
            className="w-full"
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </Button>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Verification Code</label>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                maxLength={6}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || !verificationCode}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCodeSent(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 