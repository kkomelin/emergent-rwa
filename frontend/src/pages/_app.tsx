import Layout from '@/components/layout'
// import { APP_NAME, WALLET_CONNECT_PROJECT_ID } from '@/config'
import '@/styles/globals.css'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
// import {
//   RainbowKitProvider,
//   darkTheme,
//   getDefaultConfig,
//   lightTheme,
// } from '@rainbow-me/rainbowkit'
// import '@rainbow-me/rainbowkit/styles.css'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
// import { WagmiProvider } from 'wagmi'
// import { lineaGoerli, optimismSepolia, sepolia } from 'wagmi/chains'

const inter = Inter({ subsets: ['latin'] })

// const config = getDefaultConfig({
//   appName: APP_NAME,
//   projectId: WALLET_CONNECT_PROJECT_ID,
//   chains: [sepolia, optimismSepolia, lineaGoerli],
//   ssr: true, // If your dApp uses server side rendering (SSR)
// })

// const queryClient = new QueryClient()

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://sepolia.easscan.org/graphql',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      {/* <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={{
              lightMode: lightTheme(),
              darkMode: darkTheme(),
            }}
          > */}
      <Layout>
        <Component {...pageProps} className={inter.className} />
      </Layout>
      {/* </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider> */}
    </ApolloProvider>
  )
}
