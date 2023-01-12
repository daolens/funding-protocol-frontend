import DisplayRichText from '@components/common/rich-text/display-rich-text'
import { DynamicInputItemType } from '@lib/types/common'
import React from 'react'

type Props = {
  description: string
  links: DynamicInputItemType[]
  pastProposals: DynamicInputItemType[]
}

const Description = ({ description, links, pastProposals }: Props) => {
  return (
    <div className="bg-gray-800 border border-gray-800 rounded-xl p-5 bg-opacity-20 flex flex-col gap-5">
      <h3 className="text-lg font-semibold">Application</h3>
      <p className="text-gray-500 text-sm">
        <DisplayRichText content={description} />{' '}
      </p>
      {links.length > 0 && (
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold">PROJECT LINKS</h4>
          <ol>
            {links.map((link) => (
              <li key={link.id}>
                <a
                  className="text-indigo-500 hover:underline"
                  href={link.text}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
      {pastProposals.length > 0 && (
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold">PAST SUCCESSFUL PROJECTS</h4>
          <ol>
            {pastProposals.map((link) => (
              <li key={link.id}>
                <a
                  className="text-indigo-500 hover:underline"
                  href={link.text}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default Description
