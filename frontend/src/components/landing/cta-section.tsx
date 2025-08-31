"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import GoogleSignInButton from "@/components/landing/google-signin-button"
import { NumberTicker } from "@/components/magicui/number-ticker"

export default function CTASection() {
  return (
    <section id="cta" className="relative py-16">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        {/* Heading */}
        <motion.h2
          className="text-pretty text-3xl font-semibold md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Ready to take control of your{" "}
          <span className="bg-gradient-to-tr from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            finances
          </span>
          ?
        </motion.h2>

        <motion.p
          className="mx-auto mt-3 max-w-2xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Join users who’ve simplified their money management with a beautiful,
          fast experience.
        </motion.p>

        {/* Stats Card */}
        <motion.div
          className="mx-auto mt-8 max-w-3xl"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card className="border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-lg">
            <motion.div
              className="grid gap-6 p-6 sm:grid-cols-3"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <CardContent className="contents">
                <Stat pre={10} suff="K+" v="Active users" />
                <Stat pre={96} suff="%" v="Parsing confidence" />
                <Stat pre={2} suff="M+" v="Tracked volume" />
              </CardContent>
            </motion.div>
          </Card>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <GoogleSignInButton />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button asChild variant="outline">
              <a href="#demo">Watch demo</a>
            </Button>
          </motion.div>
        </motion.div>

        <motion.p
          className="mt-2 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          No credit card required • Free forever
        </motion.p>
      </div>
    </section>
  )
}

function Stat({
  pre,
  suff,
  v,
}: {
  pre?: number
  suff?: string
  v: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className="bg-gradient-to-tr from-indigo-600 to-blue-600 bg-clip-text text-2xl font-semibold text-transparent">
        <NumberTicker
          value={pre ?? 0}
          className="whitespace-pre-wrap font-medium tracking-tighter text-indigo-600 dark:text-indigo-600"
        />
        {suff ?? ""}
      </div>
      <div className="text-muted-foreground">{v}</div>
    </motion.div>
  )
}
