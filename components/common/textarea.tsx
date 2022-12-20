import classNames from 'classnames'

type Props = React.HTMLProps<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

export default function Textarea({ label, error, ...props }: Props) {
  return (
    <div>
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-400"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          {...props}
          className={classNames(
            `block w-full rounded-xl border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-800 bg-opacity-20 sm:text-sm ${props.className}`,
            {
              'border-gray-800': !error,
              'border-red-800': error,
            }
          )}
          rows={4}
        />
      </div>
      <p className="mt-1 text-sm text-red-600" >
        {error}
      </p>
    </div>
  )
}
