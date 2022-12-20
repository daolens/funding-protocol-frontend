import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import React from 'react'

type Props = {
  onBack: () => void
}

const BackButton = ({ onBack }: Props) => {
  return (
    <button
      className="text-gray-400 self-start flex items-center text-sm gap-2 hover:underline"
      onClick={onBack}
    >
      <ArrowLeftIcon className="w-3 stroke-2" />
      Back
    </button>
  )
}

export default BackButton
