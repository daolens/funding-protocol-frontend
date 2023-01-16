import ClientOnly from '@components/common/client-only'
import ConnectWalletButton from '@components/common/connect-wallet-button'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

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

type Props = JSX.IntrinsicElements['nav']

const Navbar = (props: Props) => {
  const router = useRouter()

  const { address } = useAccount()

  const isMyProposalPage = router.pathname
    ?.split('?')[0]
    .includes('/my-proposals')

  return (
    <ClientOnly>
      <nav
        {...props}
        className={classNames(
          'flex justify-between py-4 items-center sticky top-0 z-50',
          props.className
        )}
      >
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
          {address && (
            <NavLinkItem
              key={LINKS[1].link}
              link={LINKS[1].link}
              label={LINKS[1].label}
              isActive={isMyProposalPage}
            />
          )}
        </div>
        <ConnectWalletButton />
      </nav>
    </ClientOnly>
  )
}

export default Navbar
