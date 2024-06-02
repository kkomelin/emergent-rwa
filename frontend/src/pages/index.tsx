import NFTGrid from '@/components/nft-grid'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <div className="flex w-full flex-row items-center justify-end">
        <Link
          href="#"
          className={`${buttonVariants({ variant: 'variant1' })} ml-2 mr-2 h-10 !w-auto w-24 py-2 text-center text-black last:mr-0`}
        >
          Declare/Mint an RWA NFT
        </Link>
      </div>
      <NFTGrid />
    </div>
  )
}
