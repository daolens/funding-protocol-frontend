import classNames from 'classnames'

type Props = {
  communityName: string
  rounded?: 'full'
}

const CommunityAvatar = ({ communityName, rounded }: Props) => {
  const initials = communityName
    .split(' ')
    ?.map((word) => word[0])
    .slice(0, 2)
    .join('')

  return (
    <div
      className={classNames(
        'p-4  bg-yellow-100 w-16 flex items-center justify-center',
        {
          'rounded-full': rounded,
          'rounded-md': !rounded,
        }
      )}
    >
      <p className="text-2xl text-yellow-800">{initials.toUpperCase()}</p>
    </div>
  )
}

export default CommunityAvatar
