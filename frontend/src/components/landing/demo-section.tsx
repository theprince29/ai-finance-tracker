"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export default function DemoSection() {
  return (
    <section id="demo" className="bg-muted/40 py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
        {/* Left side - steps */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold md:text-4xl">See it in action</h2>
          <p className="mt-2 text-muted-foreground">Track your finances in seconds with a streamlined flow.</p>

          <motion.ol
            className="mt-6 space-y-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.25 },
              },
            }}
          >
            <Step n={1} title="Type naturally" desc={`E.g. "Coffee $5", "Paid rent $1200", "Got salary $3500"`} />
            <Step
              n={2}
              title="Confirm details"
              desc="We extract amount, category, and confidence for you to confirm."
            />
            <Step n={3} title="View insights" desc="Get beautiful charts and trends with zero setup." />
          </motion.ol>
        </motion.div>

        {/* Right side - demo card */}
        <motion.div
          className="mx-auto w-full max-w-sm"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card className="border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-lg">
            <CardContent className="space-y-4 p-5">
              <div>
                <div className="text-xs text-muted-foreground">Quick add</div>
                <div className="mt-2 rounded-md border bg-muted/50 p-2 font-mono text-sm text-emerald-600 dark:text-emerald-400">
                  "Lunch at subway $12"
                </div>
              </div>

              <motion.div
                className="rounded-md border bg-muted/50 p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 text-xs text-muted-foreground">This month</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">$4,250</div>
                    <div className="text-xs text-muted-foreground">Income</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-rose-600 dark:text-rose-400">$2,845</div>
                    <div className="text-xs text-muted-foreground">Expenses</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="rounded-md border bg-muted/50 p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="mb-3 text-xs text-muted-foreground">Categories</div>
                <div className="space-y-2 text-sm">
                  <Row color="bg-indigo-500" label="Food" value="32%" />
                  <Row color="bg-blue-500" label="Shopping" value="24%" />
                  <Row color="bg-emerald-500" label="Transport" value="18%" />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <motion.li
      className="flex items-start gap-4"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
    >
      <div className="mt-1 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
        {n}
      </div>
      <div>
        <div className="font-medium">{title}</div>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </motion.li>
  )
}

function Row({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center">
      <span className={`mr-2 inline-block h-3 w-3 rounded-full ${color}`} aria-hidden />
      <span className="flex-1">{label}</span>
      <span>{value}</span>
    </div>
  )
}
