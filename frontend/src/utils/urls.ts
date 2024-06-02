import { TEasSupportedNetwork } from '@/types/TEasSupportedNetwork'
import { TSupportedNetwork } from '@/types/TSupportedNetwork'

export const openseaNftUrl = (
  network: TSupportedNetwork,
  collectionAddress: string,
  collectionTokenId: string
) => {
  return `https://opensea.io/assets/${network}/${collectionAddress}/${collectionTokenId}`
}

export const networkBaseUrl = (network: TEasSupportedNetwork) => {
  switch (network) {
    case 'optimism-sepolia':
      return 'https://optimism-sepolia.easscan.org'
    case 'linea':
      return 'https://linea.easscan.org'

    case 'sepolia':
    default:
      return 'https://sepolia.easscan.org'
  }
}
