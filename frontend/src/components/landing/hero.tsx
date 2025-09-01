"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import GoogleSignInButton from "@/components/landing/google-signin-button"
import useAuthStore from "@/store/useAuthstore"
import { useRouter } from "next/navigation"
import GotoDashboard from "./gotodashboard"


export default function Hero() {
  const hasUser = useAuthStore((state:any) => state.isAuthenticated)
  return (
    <section className="relative overflow-hidden h-screen" aria-label="Hero">
      {/* Subtle gradient + blurred blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -right-16 top-48 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute left-1/2 top-80 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 pt-20 pb-10 md:min-h-[75vh] md:grid-cols-2">
        {/* Left content */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.h1
            className="text-pretty text-4xl font-bold leading-tight md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Smart Money{" "}
            <span className="bg-gradient-to-tr from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 max-w-prose text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Track income and expenses with AI-style input. Just write “I bought coffee for $5” and confirm — get instant
            insights and beautiful analytics.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            {hasUser ? <GotoDashboard /> : <GoogleSignInButton />}
            <Button asChild variant="outline">
              <Link href="/explore-demo">Explore demo</Link>
            </Button>
          </motion.div>

          <motion.div
            className="mt-6 grid max-w-lg grid-cols-3 gap-3 text-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Feature label="AI-style input" desc="“Coffee $6.50” → confirm" />
            <Feature label="Beautiful charts" desc="Categories & trends" />
            <Feature label="Full control" desc="Filter, edit, delete" />
          </motion.div>
        </motion.div>

        {/* Preview card */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
        >
          <Card className="backdrop-blur supports-[backdrop-filter]:bg-card/70 shadow-xl">
            <CardContent className="p-5 md:p-6">
              <div className="mb-4">
                <div className="text-xs text-muted-foreground">Natural language input</div>
                <div className="mt-2 rounded-md border bg-muted/50 p-3 font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  <TypingAnimation startOnView={true} className="text-sm">
                    Bought Samsung watch for $250
                  </TypingAnimation>
                </div>
              </div>

              <div className="space-y-2">
                <Row label="Amount" value="$250.00" valueClass="text-indigo-600 dark:text-indigo-400" />
                <Row label="Category" value="Electronics" valueClass="text-blue-600 dark:text-blue-400" />
                <Row label="Confidence" value="96%" valueClass="text-emerald-600 dark:text-emerald-400" />
              </div>

              <Button className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700">Confirm transaction</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-muted/50 p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}

function Feature({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="font-medium">{label}</div>
      <div className="text-muted-foreground">{desc}</div>
    </div>
  )
}
