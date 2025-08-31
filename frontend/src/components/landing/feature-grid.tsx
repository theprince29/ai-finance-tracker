"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, ShieldCheck, BarChart3 } from "lucide-react"

export default function FeatureGrid() {
  return (
    <section id="features" className="py-16 mb-18">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-balance text-3xl font-semibold md:text-4xl">
            Why choose{" "}
            <span className="bg-gradient-to-tr from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Finance Tracker
            </span>
            ?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
            Experience modern personal finance with intelligent input, secure sign-in, and beautiful analytics.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <Feature
            icon={<Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            title="AI Powered"
            desc="Understands plain English and extracts amount, category, and context."
          />
          <Feature
            icon={<ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            title="Simple sign-in"
            desc="Sign in with Google (frontend-only mock) and start tracking quickly."
          />
          <Feature
            icon={<BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />}
            title="Beautiful analytics"
            desc="Clear category breakdowns and monthly trends at a glance."
          />
        </motion.div>
      </div>
    </section>
  )
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 hover:shadow-lg transition">
        <CardContent className="flex items-start gap-4 p-5">
          <div className="rounded-md border bg-muted/50 p-2">{icon}</div>
          <div>
            <div className="font-medium">{title}</div>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
