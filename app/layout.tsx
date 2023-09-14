import './globals.css'

export const metadata = {
  title: 'Bhakti Lounge - Bookings'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.webp" />
      </head>
      <body>
        <main className="min-h-screen min-w-screen bg-background flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  )
}
