import { AtSymbolIcon } from '@heroicons/react/24/outline'
import { UsersIcon } from '@heroicons/react/24/solid'
import { ApplicationTeamMemberType } from '@lib/types/grants'
import React from 'react'

type Props = {
  teamMembers: ApplicationTeamMemberType[]
}

const TeamMembers = ({ teamMembers }: Props) => {
  return (
    <div className="bg-gray-800 bg-opacity-20 border border-gray-800 p-5 flex flex-col gap-5 rounded-xl">
      <div className="flex text-sm items-center gap-2">
        <UsersIcon className="w-4 h-4" />
        <span>Team Members: {teamMembers.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        {teamMembers.map((member, index) => (
          <div className="flex text-sm gap-2" key={member.id}>
            <span className="w-5 h-5 rounded-full text-xs bg-indigo-600 flex justify-center items-center min-w-[20px]">
              {index + 1}
            </span>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-400">{member.text}</span>
              {member.email && (
                <div className="flex items-center gap-1 text-indigo-500">
                  <AtSymbolIcon className="w-5 h-5" />
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:underline"
                  >
                    {member.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeamMembers
