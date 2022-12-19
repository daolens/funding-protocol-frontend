import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { DynamicInputItemType } from '@lib/types/common'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { Dispatch, SetStateAction } from 'react'

type ItemProps = {
  text: string
  count: number
  onAdd?: () => void
  onRemove?: () => void
  onTextChange: (newText: string) => void
  inputProps: Omit<
    React.HTMLProps<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  >
}

function Item({
  count,
  text,
  onAdd,
  onRemove,
  onTextChange,
  inputProps,
}: ItemProps) {
  return (
    <div className="flex gap-2 items-center">
      <div className="relative mt-1 rounded-md shadow-sm w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="rounded-full bg-indigo-600 w-6 h-6 text-center text-sm flex items-center justify-center">
            {count}
          </span>
        </div>
        <input
          {...inputProps}
          type="text"
          className={`block w-full rounded-xl focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-800 text-gray-200 p-3 pl-11 bg-opacity-20 border-gray-800 ${inputProps.className}`}
          value={text}
          onChange={(e) => onTextChange(e.currentTarget.value)}
          onKeyUp={(e) => e.key === 'Enter' && onAdd?.()}
          autoFocus
        />
      </div>
      <button
        type="button"
        className={classNames(
          'inline-flex items-center rounded-xl border border-gray-800 bg-gray-800 bg-opacity-20 p-3 text-sm font-medium text-gray-200 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
          { 'cursor-not-allowed': onAdd && !text }
        )}
        onClick={onAdd || onRemove}
      >
        {onAdd ? (
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MinusIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

type Props = {
  items: DynamicInputItemType[]
  setItems: Dispatch<SetStateAction<DynamicInputItemType[]>>
  inputProps: Omit<
    React.HTMLProps<HTMLInputElement>,
    'type' | 'value' | 'onChange'
  >
  label?: string
  error?: string
  infoButtnDetails?: {
    text: string
    onClick: () => void
  }
}

function DynamicInputList({
  items,
  setItems,
  error,
  inputProps,
  label,
  infoButtnDetails,
}: Props) {
  const updateItemById = (
    itemId: string,
    modifiedItem: Partial<DynamicInputItemType>
  ) => {
    const copyOfItems = [...items]
    const index = copyOfItems.findIndex((item) => item.id === itemId)
    if (index === -1) return
    copyOfItems[index] = { ...copyOfItems[index], ...modifiedItem }
    setItems(copyOfItems)
  }

  const removeItemById = (itemId: string) => {
    const updatedItems = [...items].filter((item) => item.id !== itemId)
    setItems(updatedItems)
  }

  const addNewItem = () => {
    if (!items?.[items.length - 1]?.text) return
    const newItem: DynamicInputItemType = {
      id: nanoid(),
      text: '',
    }

    setItems((prev) => [...prev, newItem])
  }

  return (
    <div>
      <div className="flex justify-between">
        {label && (
          <label className="block text-sm font-medium text-gray-400">
            {label}
          </label>
        )}
        {infoButtnDetails && (
          <button
            className="flex items-center text-sm text-indigo-500 gap-1 hover:underline"
            onClick={infoButtnDetails.onClick}
          >
            <InformationCircleIcon className="w-4 stroke-2" />
            {infoButtnDetails.text}
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {items.map((item, index) => (
          <Item
            key={item.id}
            count={index + 1}
            onAdd={index === items.length - 1 ? addNewItem : undefined}
            onRemove={
              index < items.length - 1
                ? () => removeItemById(item.id)
                : undefined
            }
            text={item.text}
            onTextChange={(text) => updateItemById(item.id, { text })}
            inputProps={inputProps}
          />
        ))}
      </div>

      <p className="mt-1 text-sm text-red-600" id="email-error">
        {error}
      </p>
    </div>
  )
}

export default DynamicInputList
