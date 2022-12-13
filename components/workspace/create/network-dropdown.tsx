import { Dispatch, Fragment, SetStateAction } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { SupportedSafeInfotype } from '@lib/types/safe'
import { SupportedNetworkIdType } from '@lib/types/common'
import Image from 'next/image'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  networkId: SupportedNetworkIdType | null
  setNetworkId: Dispatch<SetStateAction<SupportedNetworkIdType | null>>
  supportedSafes: SupportedSafeInfotype[]
}

export default function NetworkDropdwon({
  networkId,
  setNetworkId,
  supportedSafes,
}: Props) {
  const selected = supportedSafes.find((safe) => safe.chainId === networkId)
  return (
    <Listbox value={networkId} onChange={setNetworkId}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-xl bg-gray-800 py-3 pl-3 pr-10 text-left shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm text-gray-200">
              <span className="flex items-center">
                <Image
                  src={selected?.logo as string}
                  alt={selected?.name as string}
                  width={24}
                  height={24}
                  className="flex-shrink-0 rounded-full"
                />
                <span className="ml-3 block truncate">{selected?.name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {supportedSafes.map((safe) => (
                  <Listbox.Option
                    key={safe.chainId}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-purple-600' : 'text-gray-200',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={safe.chainId}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <Image
                            src={safe.logo}
                            alt={safe.name}
                            width={24}
                            height={24}
                            className="flex-shrink-0 rounded-full"
                          />
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {safe.name}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-purple-500',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
