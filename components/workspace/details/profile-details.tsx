import CommunityAvatar from '@components/common/community-avatar'
import { GlobeAltIcon, ShareIcon } from '@heroicons/react/24/outline'
import { WorkspaceType } from '@lib/types/workspace'
import { onCopyText } from '@lib/utils/common'
import Image from 'next/image'
import React from 'react'

type Props = {
  workspaceDetails: WorkspaceType
  isAdmin: boolean
}

const ProfileDetails = ({
  workspaceDetails: { communityName, description, discord, twitter, website },
}: Props) => {
  const onShare = () => onCopyText(window.location.href)

  return (
    <div className="flex flex-col relative mt-7 gap-4">
      <div className="absolute top-0 left-0 -mt-20 border-2 rounded-lg">
        <CommunityAvatar communityName={communityName} />
      </div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{communityName}</h1>
        <div className="flex gap-2">
          {/* TODO: add support for change workspace settings */}
          {/* {isAdmin && (
            <button
              className="border border-gray-800 py-2 px-3 rounded-lg hover:border-indigo-800"
              onClick={onSettingsClick}
              type="button"
            >
              <Cog6ToothIcon className="w-4 h-4 strocke-2" />
            </button>
          )} */}
          <button
            className="border border-gray-800 py-2 px-3 rounded-lg hover:border-indigo-800"
            onClick={onShare}
            type="button"
          >
            <ShareIcon className="w-4 h-4 strocke-2" />
          </button>
          {/* TODO: add support for update workspace details */}
          {/* {isAdmin && (
            <button
              className="border border-gray-800 py-2 px-3 rounded-lg hover:border-indigo-800 flex items-center gap-2 text-sm"
              onClick={onEditProfile}
              type="button"
            >
              <PencilIcon className="w-4 h-4 strocke-2" />
              Edit profile
            </button>
          )} */}
        </div>
      </div>
      {(website || discord || twitter) && (
        <div className="flex gap-4">
          {website && (
            <a href={website} target="_blank" rel="noreferrer">
              <GlobeAltIcon className="w-4 h-4 text-gray-400 stroke-2" />
            </a>
          )}
          {discord && (
            <a href={discord} target="_blank" rel="noreferrer">
              <Image
                src="/images/common/discord.svg"
                width={18.4}
                height={13.6}
                alt="dicord logo"
              />
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noreferrer">
              <Image
                src="/images/common/twitter.svg"
                width={20}
                height={16.25}
                alt="twitter logo"
              />
            </a>
          )}
        </div>
      )}
      {/* TODO: add text collapse */}
      {description && <p className="text-gray-400 text-sm">{description}</p>}
    </div>
  )
}

export default ProfileDetails
