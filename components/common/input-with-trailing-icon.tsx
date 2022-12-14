import classNames from 'classnames'

type Props = React.HTMLProps<HTMLInputElement> & {
  isIconShown?: boolean
  icon?: JSX.Element
  label?: string
}

export default function Input({
  icon,
  label,
  isIconShown,
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
        <input
          type="text"
          {...inputProps}
          className={classNames(
            `block w-full rounded-xl  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-800 text-gray-200 p-3 ${inputProps.className}`,
            { 'pr-10': isIconShown }
          )}
        />
        {isIconShown && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
