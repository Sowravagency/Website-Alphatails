export const metadata = {
  title: 'Alphatails',
  description: 'Alphatails Pet Clinic & Store',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

