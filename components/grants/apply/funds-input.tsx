import Tooltip from '@components/common/tooltip'
import { InformationCircleIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'

type Props = React.HTMLProps<HTMLInputElement> & {
  label: string
  error?: string
  currency: string
  isTooltipShown: boolean
}

const FundsInput = ({
  label,
  error,
  currency,
  isTooltipShown,
  ...inputProps
}: Props) => {
  return (
    <div>
      <label
        htmlFor={inputProps.id}
        className="flex items-center text-sm font-medium text-gray-400 gap-1"
      >
        <span>{label}</span>
        {isTooltipShown && (
          <Tooltip
            content={
              <p className="max-w-xs">
                The total funds you would require for the project. It will be
                the sum of funds requested across different milestones.
              </p>
            }
            showOnHover
          >
            <InformationCircleIcon className="w-5 h-5 stroke-2 text-gray-400 cursor-pointer" />
          </Tooltip>
        )}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="number"
          placeholder="0.00"
          // To prevent negative values
          min={0}
          onInput={(e) =>
            e.currentTarget.validity.valid || (e.currentTarget.value = '')
          }
          onWheel={(e) => e.currentTarget.blur()}
          {...inputProps}
          className={classNames(
            `block w-full rounded-xl focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-800 text-gray-200 p-3 pr-12 bg-opacity-20 border ${inputProps.className}`,
            {
              'border-gray-800': !error,
              'border-red-800': error,
              'opacity-50 cursor-not-allowed': inputProps.disabled,
            }
          )}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {currency}
          </span>
        </div>
      </div>

      <p className="mt-1 text-sm text-red-600">{error}</p>
    </div>
  )
}

export default FundsInput
