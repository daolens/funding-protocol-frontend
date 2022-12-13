import '@styles/globals.css'
import { Inter } from '@next/font/google'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({ subsets: ['latin'] })

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
