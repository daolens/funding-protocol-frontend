import Navbar from '@components/common/navbar'
import classNames from 'classnames'
import Image from 'next/image'
import React from 'react'

type Props = {
  children: React.ReactNode | React.ReactNode[]
  isMaxWidthDisabled?: boolean
  isNavbarHidden?: boolean
}
const Background = ({
  children,
  isMaxWidthDisabled,
  isNavbarHidden = false,
}: Props) => {
  return (
    <div className={classNames('mx-auto min-h-screen relative')}>
      <Image
        src="/images/background/top-bg.svg"
        alt="background graphic gradient"
        height={1280}
        width={500}
        className="top-0 inset-x-0 mx-auto fixed w-[1280px] -z-10"
      />
      <Image
        src="/images/background/bottom-bg.svg"
        alt="background graphic gradient"
        height={1280}
        width={500}
        className="bottom-0 inset-x-0 mx-auto fixed w-[1280px] -z-10"
      />
      {!isNavbarHidden && (
        <Navbar className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto" />
      )}
      <div
        className={classNames('h-full w-full z-10', {
          'max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto': !isMaxWidthDisabled,
        })}
      >
        {children}
      </div>
    </div>
  )
}

export default Background
