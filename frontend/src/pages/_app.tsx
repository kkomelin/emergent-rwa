import Layout from '@/components/layout'
import { APP_NAME, WALLET_CONNECT_PROJECT_ID } from '@/config'
import '@/styles/globals.css'
import { chainMapper } from '@/utils/networks'
import { networkBaseUrl } from '@/utils/urls'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
  lightTheme,
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import { FC, PropsWithChildren } from 'react'
import { WagmiProvider, useAccount } from 'wagmi'
import { linea, optimismSepolia, sepolia } from 'wagmi/chains'

const inter = Inter({ subsets: ['latin'] })

const config = getDefaultConfig({
  appName: APP_NAME,
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains: [sepolia, optimismSepolia, linea],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme(),
            darkMode: darkTheme(),
          }}
        >
          <WalletConnectedProvider>
            <Layout>
              <Component {...pageProps} className={inter.className} />
            </Layout>
          </WalletConnectedProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

const WalletConnectedProvider: FC<PropsWithChildren> = ({ children }) => {
  const account = useAccount()

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: `${networkBaseUrl(chainMapper(account.chain?.name))}/graphql`,
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
