import { Dispatch, Fragment, SetStateAction } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { DEFAULT_TOKENS } from '@lib/constants/common'
import Image from 'next/image'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  amount: number | null
  setAmount: Dispatch<SetStateAction<number | null>>
  tokenName: string
  setTokenName: Dispatch<SetStateAction<string>>
  label?: string
  error?: string
}

export default function TokenAmountInput({
  amount,
  setAmount,
  setTokenName,
  tokenName,
  label = 'Recommended amount per proposal',
  error,
}: Props) {
  const selected = DEFAULT_TOKENS.find((token) => token.name === tokenName)
  return (
    <div className="flex flex-col">
      <label
        htmlFor="amount"
        className="block text-sm font-medium text-gray-400"
      >
        {label}
      </label>

      <div className="flex mt-2 items-center">
        <input
          type="number"
          name="amount"
          id="amount"
          className="block w-2/3 rounded-xl rounded-r-none focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-800 text-gray-200 p-3 bg-opacity-20 border border-gray-800"
          placeholder="0.00"
          value={(amount || '') as number}
          onChange={(e) => setAmount(parseInt(e.currentTarget.value) || null)}
          // To prevent negative values
          min={0}
          onInput={(e) =>
            e.currentTarget.validity.valid || (e.currentTarget.value = '')
          }
          onWheel={(e) => e.currentTarget.blur()}
        />
        <Listbox value={tokenName} onChange={setTokenName}>
          {({ open }) => (
            <>
              <div className="relative h-full grow">
                <Listbox.Button className="relative w-full h-full cursor-default rounded-xl rounded-l-none bg-gray-800 py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                  <span className="flex items-center">
                    <Image
                      src={selected?.image as string}
                      alt=""
                      width={24}
                      height={24}
                      className="h-6 w-6 flex-shrink-0 rounded-full"
                    />
                    <span className="ml-3 block truncate">
                      {selected?.name}
                    </span>
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
                  <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {DEFAULT_TOKENS.map((token) => (
                      <Listbox.Option
                        key={token.id}
                        className={({ active }) =>
                          classNames(
                            active
                              ? 'text-white bg-indigo-600'
                              : 'text-gray-200',
                            'relative cursor-default select-none py-2 pl-3 pr-9'
                          )
                        }
                        value={token.name}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <Image
                                src={token.image}
                                alt=""
                                width={24}
                                height={24}
                                className="h-6 w-6 flex-shrink-0 rounded-full"
                              />
                              <span
                                className={classNames(
                                  selected ? 'font-semibold' : 'font-normal',
                                  'ml-3 block truncate'
                                )}
                              >
                                {token.name}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-indigo-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4'
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
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
      </div>

      <p className="mt-1 text-sm text-red-600">{error}</p>
    </div>
  )
}
