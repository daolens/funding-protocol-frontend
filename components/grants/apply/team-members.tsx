import Input from '@components/common/input-with-trailing-icon'
import { TrashIcon } from '@heroicons/react/20/solid'
import { AtSymbolIcon } from '@heroicons/react/24/solid'
import { ApplicationTeamMemberType } from '@lib/types/grants'
import classNames from 'classnames'
import { nanoid } from 'nanoid'
import { Dispatch, SetStateAction } from 'react'

type ItemProps = {
  text: string
  email: string
  onTextChange: (newText: string) => void
  onEmailChange: (newEmail: string) => void
  count: number
  onRemove?: () => void
}

function Item({
  count,
  text,
  onRemove,
  onTextChange,
  email,
  onEmailChange,
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
          placeholder="Eg. Elon Tusk, our team member is a professional tweeter"
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
          placeholder="team_member@email.com"
          leadingIcon={<AtSymbolIcon className="w-5 h-5 text-gray-600" />}
          isLeadingIconShown
          value={email}
          type="email"
          onChange={(e) => onEmailChange(e.currentTarget.value as any)}
        />
      </div>
    </div>
  )
}

type Props = {
  items: ApplicationTeamMemberType[]
  setItems: Dispatch<SetStateAction<ApplicationTeamMemberType[]>>
  error?: string
}

function TeamMembers({ items, setItems, error }: Props) {
  const isAddNewItemButtonDisabled =
    !items?.[items.length - 1]?.text || !items?.[items.length - 1]?.email

  const updateItemById = (
    itemId: string,
    modifiedItem: Partial<ApplicationTeamMemberType>
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
    const newItem: ApplicationTeamMemberType = {
      id: nanoid(),
      text: '',
      email: '',
    }

    setItems((prev) => [...prev, newItem])
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-400">
          Team member details
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
            email={item.email}
            onTextChange={(text) => updateItemById(item.id, { text })}
            onEmailChange={(email) => updateItemById(item.id, { email })}
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
        + Add team member
      </button>

      <p className="mt-1 text-sm text-red-600">{error}</p>
    </div>
  )
}

export default TeamMembers
