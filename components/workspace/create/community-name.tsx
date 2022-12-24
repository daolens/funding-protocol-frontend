import Input from '@components/common/input-with-trailing-icon'
import React, { Dispatch, SetStateAction } from 'react'
import classNames from 'classnames'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

type Props = {
  communityName: string
  setCommunityName: Dispatch<SetStateAction<string>>
  onNext: () => void
}

const CHARACTER_LIMIT = 100

const CommunityName = ({ communityName, setCommunityName, onNext }: Props) => {
  const isNextAllowed = communityName.length !== 0
  return (
    <div className="flex flex-col gap-11 transition-all ease-linear">
      <h2 className="text-gray-200 font-semibold text-3xl">
        Tell us your grant community name
      </h2>
      <div className="flex flex-col gap-2">
        <Input
          placeholder={'eg. Aave grant DAO'}
          onChange={(e) => setCommunityName(e.currentTarget.value)}
          value={communityName}
          isTrailingIconShown={isNextAllowed}
          trailingIcon={<CheckCircleIcon className="w-5 h-5 text-green-500" />}
        />
        <span
          className={classNames('text-xs self-end', {
            'text-gray-500': communityName.length <= CHARACTER_LIMIT,
            'text-red-500': communityName.length > CHARACTER_LIMIT,
          })}
        >
          {communityName.length}/{CHARACTER_LIMIT}
        </span>
      </div>
      <button
        type="button"
        onClick={onNext}
        className={classNames(
          'inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start',
          { hidden: !isNextAllowed }
        )}
      >
        Next
        <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default CommunityName
