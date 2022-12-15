type Props = React.HTMLProps<HTMLInputElement> & {
  label?: string
  error?: string
}

export default function DatePicker({ label, error, ...props }: Props) {
  return (
    <div>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-400"
        >
          {label}
        </label>
      )}
      <div className="mt-2">
        <input
          {...props}
          type="date"
          className={`block w-full rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-800 sm:text-sm p-3 bg-opacity-20 border border-gray-800 ${props.className}`}
          onClick={(e) => e.currentTarget.showPicker()}
        />
      </div>

      <p className="mt-1 text-sm text-red-600" id="email-error">
        {error}
      </p>
    </div>
  )
}
