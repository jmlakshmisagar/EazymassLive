import type { Metadata } from "next";
import "./globals.css";
import { Kanit, Plus_Jakarta_Sans, Outfit } from 'next/font/google'
import { ThemeProvider } from "next-themes"
import { ToastProvider } from "@/components/toasts"

const kanit = Kanit({
  subsets: ['latin'],
  variable: '--font-kanit',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: "Eazymass",
  description: "Your effortless weight tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${kanit.variable} ${plusJakartaSans.variable} ${outfit.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <ToastProvider />
        </ThemeProvider>
        {/* <Toaster /> */}
      </body>
    </html>
  )
}
