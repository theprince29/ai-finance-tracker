"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Sun,Moon } from 'lucide-react'
import { useTheme } from "next-themes"
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger } from '@/components/ui/dropdown-menu'


const Header = () => {
  const { setTheme } = useTheme();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-indigo-600 to-blue-600" aria-hidden />
            <span className="font-semibold">Finance Tracker</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/#features" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/#demo" className="text-muted-foreground hover:text-foreground">
              Demo
            </Link>
            <Link href="/#cta" className="text-muted-foreground hover:text-foreground">
              Get started
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="hidden sm:inline-flex bg-transparent">
              <Link href="/explore-demo">Explore demo</Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className='sr-only'>Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
  )
}

export default Header