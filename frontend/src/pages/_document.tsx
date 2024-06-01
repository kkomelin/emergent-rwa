import { ThemeProvider } from '@/components/theme-provider'
import { APP_NAME } from '@/config'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head title={APP_NAME} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/images/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/images/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/images/favicon-16x16.png"
      />
      <link rel="manifest" href="/images/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/images/safari-pinned-tab.svg"
        color="#f64bfa"
      />
      <link rel="shortcut icon" href="/images/favicon.ico" />
      <meta name="msapplication-TileColor" content="#000118" />
      <meta name="msapplication-config" content="/images/browserconfig.xml" />
      <meta name="theme-color" content="#000118"></meta>

      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          <Main />
          <NextScript />
        </ThemeProvider>
      </body>
    </Html>
  )
}
