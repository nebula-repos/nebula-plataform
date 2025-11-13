"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type ContactFormCopy = {
  title: string
  description: string
  fields: Record<string, string>
  consent: string
  submit: string
  success: string
  error: string
}

export function ContactForm({ copy }: { copy: ContactFormCopy }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [feedback, setFeedback] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setFeedback("")

    const formData = new FormData(event.currentTarget)
    const payload = Object.fromEntries(formData.entries()) as Record<string, string>

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to submit contact form")
      }

      setStatus("success")
      setFeedback(copy.success)
      event.currentTarget.reset()
    } catch (error) {
      console.error(error)
      setStatus("error")
      setFeedback(copy.error)
    }
  }

  const isSubmitting = status === "submitting"

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-foreground">{copy.title}</h3>
        <p className="text-sm text-muted-foreground">{copy.description}</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">{copy.fields.name}</Label>
          <Input id="name" name="name" type="text" autoComplete="name" required disabled={isSubmitting} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">{copy.fields.email}</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required disabled={isSubmitting} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="company">{copy.fields.company}</Label>
          <Input id="company" name="company" type="text" autoComplete="organization" disabled={isSubmitting} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">{copy.fields.role}</Label>
          <Input id="role" name="role" type="text" autoComplete="organization-title" disabled={isSubmitting} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="topic">{copy.fields.topic}</Label>
          <Input id="topic" name="topic" type="text" disabled={isSubmitting} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="message">{copy.fields.message}</Label>
          <Textarea id="message" name="message" required disabled={isSubmitting} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{copy.consent}</p>
      <div className="space-y-2">
        <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : copy.submit}
        </Button>
        {feedback && (
          <p
            className={`text-sm ${status === "error" ? "text-destructive" : "text-primary"}`}
            aria-live="polite"
          >
            {feedback}
          </p>
        )}
      </div>
    </form>
  )
}
