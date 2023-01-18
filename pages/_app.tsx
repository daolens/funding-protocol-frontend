import '@styles/globals.css'
import '@styles/nprogress.css'
import '@styles/quill.css'
import { Inter } from '@next/font/google'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains'
import NProgress from 'nprogress'
import Router from 'next/router'
import Head from 'next/head'
import useNetworkDetection from '@hooks/useNetworkDetection'
import Spinner from '@components/common/spinner'

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygon, polygonMumbai],
  [publicProvider()]
)

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

NProgress.configure({ showSpinner: false })

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  const { isNetworkDetected } = useNetworkDetection()

  return (
    <>
      <Head>
        <title>GMP | DaoLens</title>
      </Head>
      <WagmiConfig client={wagmiClient}>
        <QueryClientProvider client={queryClient}>
          <main className={inter.className}>
            {isNetworkDetected ? (
              <Component {...pageProps} />
            ) : (
              <div className="h-screen w-screen flex items-center justify-center">
                <Spinner className="w-10" />
              </div>
            )}
          </main>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </WagmiConfig>
    </>
  )
}
