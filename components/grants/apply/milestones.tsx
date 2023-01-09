import Input from '@components/common/input-with-trailing-icon'
import { TrashIcon } from '@heroicons/react/20/solid'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'
import { ApplicationMilestoneType } from '@lib/types/grants'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { Dispatch, SetStateAction } from 'react'

type ItemProps = {
  text: string
  funds: number
  onTextChange: (newText: string) => void
  onFundsChange: (newFunds: number) => void
  count: number
  onRemove?: () => void
}

function Item({
  count,
  text,
  onRemove,
  onTextChange,
  funds,
  onFundsChange,
}: ItemProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="pointer-events-none flex items-center pt-3">
        <span className="rounded-full bg-indigo-600 w-6 h-6 text-center text-sm flex items-center justify-center">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-2 flex-grow">
        <Input
          placeholder="Describe milestone eg. Submit prototype"
          trailingIcon={
            <button onClick={onRemove} className="z-10">
              <TrashIcon className="text-red-700 w-5 opacity-75 hover:opacity-100" />
            </button>
          }
          isTrailingIconShown={!!onRemove}
          value={text}
          onChange={(e) => onTextChange(e.currentTarget.value)}
        />
        <Input
          placeholder="Set funds for the milestone"
          leadingIcon={<CurrencyDollarIcon className="w-5 h-5 text-gray-600" />}
          isLeadingIconShown
          value={funds}
          type="number"
          onChange={(e) => onFundsChange(e.currentTarget.value as any)}
          // To prevent negative values
          min={0}
          onInput={(e) =>
            e.currentTarget.validity.valid || (e.currentTarget.value = '')
          }
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>
    </div>
  )
}

type Props = {
  items: ApplicationMilestoneType[]
  setItems: Dispatch<SetStateAction<ApplicationMilestoneType[]>>
  error?: string
  totalFundsSeeking: number
}

function Milestones({ items, setItems, error, totalFundsSeeking }: Props) {
  const isAddNewItemButtonDisabled =
    !items?.[items.length - 1]?.text || !items?.[items.length - 1]?.funds

  const updateItemById = (
    itemId: string,
    modifiedItem: Partial<ApplicationMilestoneType>
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
    if (isAddNewItemButtonDisabled) return
    const newItem: ApplicationMilestoneType = {
      id: nanoid(),
      text: '',
      funds: null,
      status: 'Submitted',
    }

    setItems((prev) => [...prev, newItem])
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-400">
          Define milestone
        </label>
      </div>
      <div className="mt-2 flex flex-col gap-5">
        {items.map((item, index) => (
          <Item
            key={item.id}
            count={index + 1}
            onRemove={
              items.length > 1 ? () => removeItemById(item.id) : undefined
            }
            text={item.text}
            funds={item.funds as any}
            onTextChange={(text) => updateItemById(item.id, { text })}
            onFundsChange={(funds) => updateItemById(item.id, { funds })}
          />
        ))}
      </div>
      <button
        className={classNames('self-end text-indigo-500 hover:underline mt-1', {
          'cursor-not-allowed opacity-70': isAddNewItemButtonDisabled,
        })}
        onClick={addNewItem}
        disabled={isAddNewItemButtonDisabled}
      >
        + Add milestone
      </button>

      <p className="mt-1 text-sm text-red-600">{error}</p>
      {!!totalFundsSeeking && (
        <p className="mt-1 text-xs text-gray-400">
          Total seeking funds:{' '}
          <span className="text-gray-300 fond-semibold">
            {totalFundsSeeking} USDC
          </span>
        </p>
      )}
    </div>
  )
}

export default Milestones
