import { Fragment, useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAccount, useDisconnect, useEnsName, useNetwork } from 'wagmi'
import { getTruncatedWalletAddress } from '@lib/utils/common'
import { CreditCardIcon } from '@heroicons/react/24/solid'
import { Chain as getChainDetails } from '@lib/utils/wallet'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import ClientOnly from '@components/common/client-only'
import ConnectWalletModal from '@components/common/connect-wallet-modal'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function WalletDropdown() {
  const { address } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState(false)

  const chainDetails = chain?.id ? getChainDetails(chain?.id) : null
  const blockExplorerLink = chainDetails?.blockExplorers?.default?.url

  return (
    <ClientOnly>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center items-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
            <CreditCardIcon className="w-4 h-4 mr-2" />
            {address ? getTruncatedWalletAddress(address) : 'Wallet'}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right divide-y divide-gray-800 rounded-xl bg-gray-900 shadow-lg ring-1 ring-gray-800 border border-gray-800 ring-opacity-5 focus:outline-none">
            <div className="px-4 py-3 gap-4 flex flex-col">
              <p>
                {ensName || (address ? getTruncatedWalletAddress(address) : '')}
              </p>
              <div className="flex gap-3 text-xs">
                <button
                  onClick={() => disconnect()}
                  className="border border-gray-800 text-gray-500 hover:text-gray-300 py-2 px-3 rounded-md hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 whitespace-nowrap"
                >
                  DISCONNECT
                </button>
                <button
                  onClick={() => setIsConnectWalletModalOpen(true)}
                  className="border border-gray-800 text-gray-500 hover:text-gray-300 py-2 px-3 rounded-md hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 whitespace-nowrap"
                >
                  SWITCH WALLET
                </button>
              </div>
            </div>
            <div className="py-1">
              <Menu.Item>
                {() => (
                  <div className="px-4 py-2 text-xs flex flex-col border-b border-gray-800">
                    <div className="flex justify-between">
                      <span>Network</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-green-500" />
                        {chainDetails?.name}
                      </span>
                    </div>
                    {/* TODO: add alert if not polygon mumbai */}
                  </div>
                )}
              </Menu.Item>
              {blockExplorerLink && (
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={`${blockExplorerLink}/address/${address}`}
                      target="_blank"
                      rel="noreferrer"
                      className={classNames(
                        active ? 'underline' : 'text-gray-400',
                        'px-4 py-2 text-sm flex gap-2 items-center'
                      )}
                    >
                      <ArrowTopRightOnSquareIcon className="w-5" />
                      View on Explorer
                    </a>
                  )}
                </Menu.Item>
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      <ConnectWalletModal
        isOpen={isConnectWalletModalOpen}
        setIsOpen={setIsConnectWalletModalOpen}
      />
    </ClientOnly>
  )
}
