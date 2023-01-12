import WalletAddress from '@components/common/wallet-address'
import { APPLICATION_STATUS_OBJ } from '@lib/constants/grants'
import { WalletAddressType } from '@lib/types/common'
import { ApplicationStatusType } from '@lib/types/grants'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  applicantWalletAddress: WalletAddressType
  title: string
  status: ApplicationStatusType
  id: string
}

const ApplicationCard = ({
  applicantWalletAddress,
  status,
  title,
  id,
}: Props) => {
  const router = useRouter()

  const workspaceId = router.query.workspaceId
  const grantAddress = router.query.grantAddress

  const statusColor = APPLICATION_STATUS_OBJ[status].color
  const statusLabel = APPLICATION_STATUS_OBJ[status].label

  return (
    <Link
      href={`/workspaces/${workspaceId}/grants/${grantAddress}/applications/${id}`}
      className="flex flex-col p-5 gap-3 bg-gray-800 rounded-xl border border-gray-800 hover:border-indigo-500"
    >
      <p className="text-gray-600 text-xs">
        Proposed by <WalletAddress address={applicantWalletAddress} />
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
        <span className="text-xs">{statusLabel}</span>
      </div>
    </Link>
  )
}

export default ApplicationCard
