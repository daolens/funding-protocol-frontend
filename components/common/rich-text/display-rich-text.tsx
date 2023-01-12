import 'react-quill/dist/quill.snow.css'
import DOMPurify from 'isomorphic-dompurify'

type Props = {
  content: string
}

const DisplayRichText = ({ content }: Props) => {
  return (
    <div
      className="display-rich-text"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
    />
  )
}

export default DisplayRichText
