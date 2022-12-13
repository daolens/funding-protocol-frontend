import React from 'react'

const Button = () => {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-xl border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start"
    >
      Next
      <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
    </button>
  )
}

export default Button
