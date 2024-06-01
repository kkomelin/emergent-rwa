import { APP_NAME } from '@/config'
import Image from 'next/image'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/images/logo.svg"
        width={170}
        height={170}
        alt={`${APP_NAME} Logo`}
      />
    </Link>
  )
}

export default Logo
