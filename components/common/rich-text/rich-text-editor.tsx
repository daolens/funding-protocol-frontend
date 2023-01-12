import { Dispatch, SetStateAction } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

/*
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
const MODULES = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    // [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
}

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const FORMATS = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
]

type Props = {
  id?: string
  content: string
  setContent: Dispatch<SetStateAction<string>>
  label?: string
  error?: string
  placeholder?: string
}

const RichTextEditor = ({
  content,
  setContent,
  id,
  label,
  error,
  placeholder,
}: Props) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400">
        {label}
      </label>
      <div className="editor bg-gray-900 mt-2">
        <ReactQuill
          id={id}
          theme={'snow'}
          onChange={(html) => setContent(html)}
          value={content}
          modules={MODULES}
          formats={FORMATS}
          bounds={'.editor'}
          placeholder={placeholder}
        />
      </div>
      <p className="mt-1 text-sm text-red-600">{error}</p>
    </div>
  )
}

export default RichTextEditor
