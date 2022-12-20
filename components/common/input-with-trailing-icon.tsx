import classNames from 'classnames'

type Props = React.HTMLProps<HTMLInputElement> & {
  isTrailingIconShown?: boolean
  isLeadingIconShown?: boolean
  leadingIcon?: JSX.Element
  trailingIcon?: JSX.Element
  label?: string
  error?: string
}

export default function Input({
  trailingIcon,
  leadingIcon,
  label,
  isTrailingIconShown,
  isLeadingIconShown,
  error,
  ...inputProps
}: Props) {
  return (
    <div>
      <label
        htmlFor={inputProps.id}
        className="block text-sm font-medium text-gray-400"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {isLeadingIconShown && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {leadingIcon}
          </div>
        )}
        <input
          type="text"
          {...inputProps}
          className={classNames(
            `block w-full rounded-xl  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-800 text-gray-200 p-3 bg-opacity-20 border  ${inputProps.className}`,
            {
              'pr-10': isTrailingIconShown,
              'pl-10': isLeadingIconShown,
              'border-gray-800': !error,
              'border-red-800': error,
            }
          )}
        />
        {isTrailingIconShown && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {trailingIcon}
          </div>
        )}
      </div>
      <p className="mt-1 text-sm text-red-600">{error}</p>
    </div>
  )
}
