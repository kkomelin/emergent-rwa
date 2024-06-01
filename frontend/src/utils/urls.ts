import { TSupportedNetwork } from '@/types/TSupportedNetwork'

export const openseaNftUrl = (
  network: TSupportedNetwork,
  collectionAddress: string,
  collectionTokenId: string
) => {
  return `https://opensea.io/assets/${network}/${collectionAddress}/${collectionTokenId}`
}
