type Props = React.HTMLProps<HTMLTextAreaElement> & {
  label?: string
}

export default function Textarea({ label, ...props }: Props) {
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
          className={`block w-full rounded-xl border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-800 bg-opacity-20 sm:text-sm ${props.className}`}
          rows={4}
        />
      </div>
    </div>
  )
}
