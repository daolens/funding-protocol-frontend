import { APPLICATION_STATUS_OBJ } from '@lib/constants/grants'
import { WalletAddressType } from '@lib/types/common'
import { ApplicationStatusType } from '@lib/types/grants'
import { getTruncatedWalletAddress } from '@lib/utils/common'
import classNames from 'classnames'
import { useEnsName } from 'wagmi'

type Props = {
  applicantWalletAddress: WalletAddressType
  title: string
  status: ApplicationStatusType
}

const ApplicationCard = ({ applicantWalletAddress, status, title }: Props) => {
  const { data: ensName } = useEnsName({
    address: applicantWalletAddress,
  })

  const statusColor = APPLICATION_STATUS_OBJ[status].color

  const onApplicationClick = () => {
    // TODO: handle
  }

  return (
    <button
      className="flex flex-col p-5 gap-3 bg-gray-800 rounded-xl border border-gray-800 hover:border-indigo-500"
      onClick={onApplicationClick}
    >
      <p className="text-gray-600 text-xs">
        Proposed by{' '}
        {ensName || getTruncatedWalletAddress(applicantWalletAddress)}
      </p>
      <h3>{title}</h3>
      <div className="flex items-center gap-2 bg-gray-700 self-start rounded-xl py-1 px-3 text-gray-500 bg-opacity-50">
        <span
          className={classNames('h-2 w-2 rounded-full', {
            'bg-yellow-500': statusColor === 'yellow',
            'bg-cyan-500': statusColor === 'cyan',
            'bg-red-500': statusColor === 'red',
          })}
        />
        <span className="text-xs">{status}</span>
      </div>
    </button>
  )
}

export default ApplicationCard
