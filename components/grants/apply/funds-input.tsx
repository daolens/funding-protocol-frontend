import classNames from 'classnames'

type Props = React.HTMLProps<HTMLInputElement> & {
  label: string
  error?: string
  currency: string
}

const FundsInput = ({ label, error, currency, ...inputProps }: Props) => {
  return (
    <div>
      <label
        htmlFor={inputProps.id}
        className="block text-sm font-medium text-gray-400"
      >
        {/* TODO: add tooltip */}
        {label}
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
            { 'border-gray-800': !error, 'border-red-800': error }
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
