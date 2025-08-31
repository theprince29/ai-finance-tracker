"use client"

import { useEffect, useState } from "react"

export default function Typewriter({
  text,
  speed = 80,
  className,
}: {
  text: string
  speed?: number
  className?: string
}) {
  const [out, setOut] = useState("")
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      setOut((prev) => (i < text.length ? prev + text[i++] : prev))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return <span className={className}>{out}</span>
}
