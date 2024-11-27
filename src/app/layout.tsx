import type { Metadata } from "next";
import "./globals.css"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  keywords: ['FABR', 'FABR-Network', 'BFA', 'Futebol Americano Brasil', 'Futebol Americano'],
  openGraph: {
    title: 'FABR-Network',
    description: 'Seu site sobre futebol americano brasileiro.',
    siteName: 'FABR-Network',
    images: '/assets/logo-fabr-color.png'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" className={poppins.className}>
      <head>
        <link rel="shortcut icon" href="/assets/favicon.png" type="image/x-icon" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
