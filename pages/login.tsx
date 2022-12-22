import ClientOnly from '@components/common/client-only'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
} from 'wagmi'

function Home() {
  const { address, connector, isConnected } = useAccount()
  const { data: ensAvatar } = useEnsAvatar({ address })
  const { data: ensName } = useEnsName({ address })
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <ClientOnly>
        <div>
          {ensAvatar && <img src={ensAvatar} alt="ENS Avatar" />}
          <div>{ensName ? `${ensName} (${address})` : address}</div>
          <div>Connected to {connector?.name}</div>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <div className="flex flex-col gap-5 p-10">
        {connectors.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
            className="border rounded-lg p-3 hover:bg-gray-700"
          >
            {connector.name}
            {!connector.ready && ' (unsupported)'}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              ' (connecting)'}
          </button>
        ))}

        {error && <div>{error.message}</div>}
      </div>
    </ClientOnly>
  )
}

export default Home
