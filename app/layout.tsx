
export const metadata = {
  title: 'Covalent wallet watcher',
  description:
    'A notification system powered by Covalent',
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className='relative min-h-screen w-screen'>
          {children}
        </div>
        </body>
    </html>
  )
}
