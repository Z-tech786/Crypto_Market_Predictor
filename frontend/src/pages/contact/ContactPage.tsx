import { useState, type FormEvent } from 'react'
import { Mail, MessageSquare, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.get('firstName')} ${formData.get('lastName')}`,
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      toast.success("Message sent successfully! We'll get back to you soon.")
      form.reset()
    } catch {
      toast.error('Something went wrong. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <section>
          <h1 className="mb-4 text-4xl font-bold">Get in Touch</h1>
          <p className="mb-8 max-w-xl text-lg text-muted-foreground">
            Have questions about our AI crypto predictions? Our team is here to help.
          </p>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary" />
            <a href="mailto:support@cryptowise.ai">support@cryptowise.ai</a>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span>We typically respond within 24 hours.</span>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Fill out the form and our team will get back to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input name="firstName" placeholder="First name" required />
                <Input name="lastName" placeholder="Last name" required />
              </div>
              <Input name="email" type="email" placeholder="Email address" required />
              <Input name="subject" placeholder="Subject" required />
              <Textarea name="message" placeholder="How can we help?" required />
              <Button type="submit" disabled={isSubmitting}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
