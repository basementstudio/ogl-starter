import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { Header } from "~/components/header/header"

import { AppHooks } from "./app-hooks"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ogl-starter | basement.studio",
  description: "A minimalist's boilerplate — OGL with Next.js & TypeScript."
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHooks />
        <Header />
        {children}
      </body>
    </html>
  )
}
