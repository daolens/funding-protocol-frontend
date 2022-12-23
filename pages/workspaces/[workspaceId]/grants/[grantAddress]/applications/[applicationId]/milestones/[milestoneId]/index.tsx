import BackButton from '@components/common/back-button'
import Background from '@components/common/background'
import Textarea from '@components/common/textarea'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import classNames from 'classnames'
import { useState } from 'react'

const MilestoneDetails = () => {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Background>
      <div className="py-6 flex flex-col gap-3">
        <BackButton onBack={() => {}} />
      </div>
      <div className="text-2xl font-semibold mb-2">Milestone 1 report</div>
      <div className="text-sm text-gray-500 mb-6">
        Goal: Defining the structure and designing the whole basketball court in
        UniSwap’s theme and some more things as place
      </div>
      <span className="text-gray-400">Proof of work</span>
      <Textarea
        placeholder="Tell us all about the goals you achieved for this milestone"
        className="h-[400px]"
      />
      <div className="w-full max-w-7xl fixed mx-auto left-0 right-0 bottom-0 mb-6 px-8">
        <div className="flex w-full max-w-7xl items-end justify-end p-4 border rounded-2xl border-gray-700 bg-gray-900 bg-opacity-50 border-opacity-50 backdrop-blur-md">
          <button
            type="button"
            disabled={isLoading}
            className={classNames(
              'inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 self-start',
              {
                'cursor-not-allowed opacity-50': isLoading,
              }
            )}
          >
            Submit
            <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Background>
  )
}
export default MilestoneDetails
