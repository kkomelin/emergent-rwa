import Layout from '@/components/layout'
import '@/styles/globals.css'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  walletConnect,
} from '@thirdweb-dev/react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const activeChain = 1

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://sepolia.easscan.org/graphql',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThirdwebProvider
        supportedWallets={[
          metamaskWallet({
            recommended: true,
          }),
          coinbaseWallet(),
          walletConnect(),
        ]}
        clientId="1444065fa50cbb8ca2aec4b607aeb23a"
        activeChain={activeChain}
      >
        <Layout>
          <Component {...pageProps} className={inter.className} />
        </Layout>
      </ThirdwebProvider>
    </ApolloProvider>
  )
}
