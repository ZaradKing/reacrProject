import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EmployeeHub - Professional Employee Search Platform",
  description: "Search, discover, and manage employee information with our comprehensive database platform",
  keywords: "employee search, staff directory, professional network, employee management",
  authors: [{ name: "EmployeeHub Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          async
        />
      </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
