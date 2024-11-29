import type { Metadata } from "next";
import "./globals.css"
import { Poppins } from "next/font/google"
import Image from "next/image";

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
        <header className="w-full h-20 bg-black flex justify-center items-end px-2 fixed z-50">
          <div className="w-28 h-16 flex justify-center items-end p-2">
            <Image
              src="/assets/logo-fabr-color.png"
              width={100}
              height={100}
              alt="logo-fabr"
              quality={100}
              priority
              className="w-auto h-auto"
            />
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
