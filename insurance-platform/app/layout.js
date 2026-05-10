import './globals.css'

export const metadata = {
  title: 'The Insurance App',
  description: 'AI-Powered Medical Billing Platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}