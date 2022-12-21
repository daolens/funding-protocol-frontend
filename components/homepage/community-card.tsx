import Image from 'next/image'
import { UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { CommunityDetailsType } from '@lib/types/home'

type Props = {
  communityDetailsData: CommunityDetailsType[]
}

const CommunityCard = ({ communityDetailsData }: Props) => {
  return (
    <Fragment>
      {communityDetailsData?.map((val, idx) => (
        <div key={idx}>
          <div className="pt-5 pb-6 px-5 bg-gray-800 border bg-opacity-40 border-gray-800 rounded-tl-2xl rounded-tr-2xl flex flex-col gap-6">
            <div className="flex gap-4">
              <Image
                src={val?.image}
                alt={val?.communityName}
                width={68}
                height={68}
                className="rounded-full"
              />
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold">{val.communityName}</h3>
                <div className="flex gap-1">
                  <p className="px-3 py-[6px] bg-[#1F2937CC] text-xs rounded-2xl flex justify-center items-center">
                    <span className="text-[8px] mr-1">
                      {val.activeGrants > 0 ? '🟢' : '🔴'}
                    </span>
                    <span>{val.activeGrants} Active grants</span>
                  </p>
                  <p className="px-3 py-[6px] bg-[#1F2937CC] text-xs rounded-2xl">
                    💰 ${val.treasuryAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex text-xs gap-[18px]  px-5 py-2 bg-gray-800 rounded-bl-2xl rounded-br-2xl">
              <p className="flex justify-center items-center gap-[6px]">
                <UserIcon className="w-4 h-4" />
                <span>{val.applicants} Applicants</span>
              </p>
              <p className="flex justify-center items-center gap-[6px]">
                <CurrencyDollarIcon className="w-4 h-4" />
                <span>${val.sentInGrants.toLocaleString()} sent in grants</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  )
}

export default CommunityCard
