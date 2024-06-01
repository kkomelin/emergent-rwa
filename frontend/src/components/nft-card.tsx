import { TSupportedNetwork } from '@/types/TSupportedNetwork'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import EthereumIcon from '../assets/icons/ethereum.svg'
import LineaIcon from '../assets/icons/linea.svg'
import OptimismIcon from '../assets/icons/optimism.svg'
import { CardBody, CardContainer, CardItem } from './ui/3d-card'

const NFTCard = ({ nft }: { nft: any }) => {
  return (
    <CardContainer>
      <CardBody className="group/card relative flex h-auto w-auto flex-col rounded-xl border border-black/[0.1] bg-gray-50 p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
        <Link
          href={`/nft/${nft.collectionAddress}/${nft.collectionTokenId}`}
          className="flex h-full grow flex-col"
        >
          <CardItem
            translateZ="50"
            className="grow text-xl font-bold text-neutral-600 dark:text-white"
          >
            {nft.name}
          </CardItem>
          <CardItem translateZ="100" className="mt-4 overflow-hidden">
            <Image
              src={nft.imageUrl}
              height="1000"
              width="1000"
              className="max-w-200 h-60 rounded-xl object-cover group-hover/card:shadow-xl"
              alt={nft.title || 'NFT Image'}
            />
          </CardItem>
          <div className="mt-6 flex items-center justify-between">
            <CardItem
              translateZ={20}
              as="button"
              className="rounded-xl px-4 py-2 text-xs font-normal dark:text-white"
            >
              View Attestations →
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              className="rounded-full bg-black p-1 text-xs font-bold text-white dark:bg-white dark:text-black"
            >
              <span className="sr-only">{nft.chain}</span>
              <NetworkIcon network={(nft.chain || 'ethereum').toLowerCase()} />
            </CardItem>
          </div>
        </Link>
      </CardBody>
    </CardContainer>
  )
}

export default NFTCard

const NetworkIcon = ({
  network,
}: {
  network: TSupportedNetwork
}): ReactNode => {
  switch (network) {
    case 'optimism':
      return <OptimismIcon />
    case 'linea':
      return <LineaIcon />
    case 'ethereum':
    default:
      return <EthereumIcon />
  }
}
