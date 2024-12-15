import type { Metadata } from "next"
import "./globals.css"
import { Poppins } from "next/font/google"
import Image from "next/image";
import { Tab } from "@/components/Tab"
import Link from "next/link";
import { Analytics } from '@vercel/analytics/react';

const poppins = Poppins({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
})

export const metadata: Metadata = {
  metadataBase: new URL('https://fabrnetwork.com.br/'),
  title: 'FABR-Network',
  description: "O banco de dados do futebol americano do Brasil.",
  keywords: ['FABR', 'FABR-Network', 'BFA', 'Futebol Americano Brasil', 'Futebol Americano', 'NFL', 'NFL Brasil', 'ESPN',
    'Futebol Americano Brasileiro', 'Flag', 'Flag Football', 'Brasileirão de Futebol Americano', 'Brasileirão', 'CBFA', 'Liga BFA', 'Salão Oval',
    'Mapa do FABR', 'Brasil Bowl', 'Super Bowl', 'Times de Futebol Americano Brasil', 'Campeonato Brasileiro de Futebol Americano', 'Football Brasil',
    'Touchdown Brasil', 'Playoffs BFA', 'Ranking Nacional FA', 'Estatísticas Futebol Americano', 'Jogadores Brasileiros FA', 'Copa Brasil FA', 'Conferências BFA',
    'Divisões BFA', 'Draft Brasil FA', 'Quarterback Brasil', 'Temporada Regular BFA', 'Combine Brasil', 'Scouting Brasil FA', 'Bowl Games Brasil',
    'Torneios Regionais FA', 'Desenvolvimento FA Brasil', 'Seleção Brasileira FA', 'Wide Receiver Brasil', 'Running Back Brasil', 'Defensive End Brasil',
    'Safety Brasil', 'Linebacker Brasil', 'Special Teams Brasil', 'Placekicker Brasil', 'Punter Brasil', 'Cornerback Brasil', 'Tight End Brasil',
    'Final Nacional FA', 'Semifinal BFA', 'Norte Bowl', 'Sul Bowl', 'Nordeste Bowl', 'Centro-Oeste Bowl', 'Sudeste Bowl', 'Tryouts Brasil FA', 'Preseason BFA',
    'All-Star Game Brasil FA', 'Field Goal Brasil', 'Extra Point Brasil', 'Two Point Conversion', 'Fair Catch Brasil', 'Snap Brasil', 'Huddle Brasil', 'Blitz Brasil FA',
    'Tackle Brasil', 'Cheerleaders FA Brasil', 'Torcida Organizada FA', 'Brasil Onças'
  ],
  openGraph: {
      title: 'FABR-Network',
      description: 'O banco de dados do futebol americano do Brasil.',
      siteName: 'FABR-Network',
      images: '/assets/logo-fabr-color.png'
  }
};

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
          <Link href="/" className="w-28 h-16 flex justify-center items-end p-2">
            <Image
              src="/assets/logo-fabr-color.png"
              width={100}
              height={100}
              alt="logo-fabr"
              quality={100}
              priority
              className="w-auto h-auto"
            />
          </Link>
        </header>
        {children}
        <Analytics />
        <Tab />
      </body>
    </html>
  )
}
