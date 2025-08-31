import Link from "next/link"

export default function SiteFooter() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-indigo-600 to-blue-600" aria-hidden />
            <span className="text-lg font-semibold">Finance Tracker</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            The simplest way to manage your money with AI-style input and beautiful analytics.
          </p>
        </div>

        <Col
          title="Product"
          items={[
            ["/finance", "Features"],
            ["#", "Pricing"],
            ["#", "Security"],
          ]}
        />
        <Col
          title="Company"
          items={[
            ["#", "About"],
            ["#", "Blog"],
            ["#", "Careers"],
          ]}
        />
        <Col
          title="Support"
          items={[
            ["#", "Help Center"],
            ["#", "Contact"],
            ["#", "Privacy"],
          ]}
        />
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Finance Tracker. All rights reserved.
      </div>
    </footer>
  )
}

function Col({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="font-semibold">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map(([href, label]) => (
          <li key={label}>
            <Link href={href} className="hover:text-foreground">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
