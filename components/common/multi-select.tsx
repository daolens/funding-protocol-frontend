import { Dispatch, Fragment, SetStateAction } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type Props = {
  selected: string[]
  setSelected: Dispatch<SetStateAction<string[]>>
  options: string[]
  error?: string
  label: string
  placeholder: string
}

export default function MultiSelect({
  selected,
  setSelected,
  options,
  error,
  label,
  placeholder,
}: Props) {
  return (
    <div>
      <Listbox value={selected} onChange={setSelected} multiple>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-400">
              {label}
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-xl border border-gray-800 bg-gray-800 bg-opacity-20 py-1 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                {selected.length > 0 ? (
                  <span className="flex truncate flex-wrap gap-1">
                    {selected.map((item) => (
                      <span
                        key={item}
                        className="border border-gray-800 rounded-lg px-3 py-2"
                      >
                        {item}
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="opacity-50 py-2 block">{placeholder}</span>
                )}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
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
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((item) => (
                    <Listbox.Option
                      key={item}
                      className={({ active }) =>
                        classNames(
                          active ? 'text-white bg-indigo-600' : 'text-gray-200',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate'
                            )}
                          >
                            {item}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-400',
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
      <p className="mt-1 text-sm text-red-600">{error}</p>
    </div>
  )
}
