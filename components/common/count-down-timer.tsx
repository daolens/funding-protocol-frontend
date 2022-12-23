import React, { useEffect, useState } from 'react'

const getTimeRemaining = (endTime: string) => {
  const total = Date.parse(endTime) - Date.parse(new Date().toISOString())
  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor(total / 1000 / 60 / 60)
  return {
    total,
    hours,
    minutes,
    seconds,
  }
}

const getFormatedTimeString = (
  hours: number,
  minutes: number,
  seconds: number
) =>
  (hours > 9 ? hours : '0' + hours) +
  ':' +
  (minutes > 9 ? minutes : '0' + minutes) +
  ':' +
  (seconds > 9 ? seconds : '0' + seconds)

type Props = React.HTMLProps<HTMLParagraphElement> & {
  endTime: string
}

const CountDownTimer = ({ endTime, ...divProps }: Props) => {
  const [timer, setTimer] = useState('00:00:00')

  useEffect(() => {
    const interval = setInterval(() => {
      const { hours, minutes, seconds } = getTimeRemaining(endTime)
      const newTimer = getFormatedTimeString(hours, minutes, seconds)
      setTimer(newTimer)
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [endTime])
  return <p {...divProps}>{timer}</p>
}

export default CountDownTimer
