type Props = {
  communityName: string
}

const CommunityAvatar = ({ communityName }: Props) => {
  const initials = communityName
    .split(' ')
    ?.map((word) => word[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="p-4 rounded-md bg-yellow-100">
      <p className="text-2xl text-yellow-800">{initials}</p>
    </div>
  )
}

export default CommunityAvatar
