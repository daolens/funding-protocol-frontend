import ConnectWalletButton from '@components/common/connect-wallet-button'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

type NavLinkItemProps = {
  label: string
  link: string
  isActive: boolean
}

const NavLinkItem = ({ label, link }: NavLinkItemProps) => (
  <Link
    href={link}
    className={classNames('text-sm px-3 py-2 rounded-xl hover:underline')}
  >
    {label}
  </Link>
)

const LINKS: { link: string; label: string }[] = [
  {
    link: '/',
    label: 'Discover',
  },
  {
    link: '/my-proposals',
    label: 'My Proposals',
  },
]

const Navbar = () => {
  const router = useRouter()

  const isMyProposalPage = router.pathname
    ?.split('?')[0]
    .includes('/my-proposals')

  return (
    <nav className="flex justify-between py-4 items-center">
      <Link href="/">
        <Image
          src="/images/logo/logo-white.svg"
          width={124}
          height={24}
          alt="DaoLens logo"
        />
      </Link>
      <div className="flex gap-8">
        <NavLinkItem
          key={LINKS[0].link}
          link={LINKS[0].link}
          label={LINKS[0].label}
          isActive={!isMyProposalPage}
        />
        <NavLinkItem
          key={LINKS[1].link}
          link={LINKS[1].link}
          label={LINKS[1].label}
          isActive={isMyProposalPage}
        />
      </div>
      <ConnectWalletButton />
    </nav>
  )
}

export default Navbar
