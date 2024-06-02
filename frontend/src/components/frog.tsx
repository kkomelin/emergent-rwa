import { chainMapper } from '@/utils/networks'
import clsx from 'clsx'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export const Frog = () => {
  const [visible, setVisible] = useState(false)
  const [left, setLeft] = useState(100)
  const [top, setTop] = useState(100)
  const account = useAccount()

  useEffect(() => {
    const timeout1 = setInterval(() => {
      setVisible((visible) => !visible)
      setTop(Math.floor(Math.random() * 100))
      setLeft(Math.floor(Math.random() * 100))
      console.log(left, top)
    }, 2000)

    return () => clearTimeout(timeout1)
  }, [])

  return (
    <div
      className={clsx(
        `absolute left-0 top-0 z-[1050] m-6 h-40 w-40 transform rounded-full bg-white p-4`,
        {
          hidden: !visible || chainMapper(account.chain?.name) !== 'linea',
        }
      )}
    >
      <Image
        className="rounded-full"
        width={200}
        height={200}
        src="/images/frog.jpeg"
        alt="frog"
      />
    </div>
  )
}
