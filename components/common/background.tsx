import Image from 'next/image'
import React from 'react'

type Props = {
  children: React.ReactNode | React.ReactNode[]
}
const Background = ({ children }: Props) => {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-h-screen relative">
      <Image
        src="/images/background/top-bg.svg"
        alt="background graphic gradient"
        height={1280}
        width={500}
        className="top-0 fixed w-[1280px] -z-10"
      />
      <Image
        src="/images/background/bottom-bg.svg"
        alt="background graphic gradient"
        height={1280}
        width={500}
        className="bottom-0 fixed w-[1280px] -z-10"
      />
      <div className='h-full w-full z-10'>{children}</div>
    </div>
  )
}

export default Background
