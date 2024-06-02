import { TEasSupportedNetwork } from '@/types/TEasSupportedNetwork'

export const chainMapper = (
  walletChain: string | undefined
): TEasSupportedNetwork => {
  switch (walletChain) {
    case 'OP Sepolia':
      return 'optimism-sepolia'
    case 'Linea Mainnet':
      return 'linea'

    case 'Sepolia':

    default:
      return  'sepolia'
  }
}
