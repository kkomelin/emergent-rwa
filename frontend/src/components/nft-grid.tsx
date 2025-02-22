import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Core } from '@quicknode/sdk'
import { useEffect, useState } from 'react'
import nftList from './collections'
import NFTCard from './nft-card'

interface OrganizedTokens {
  [collectionName: string]: Token[]
}

const organizeNFTsByCollection = (tokens: Token[]) => {
  return tokens.reduce((accumulator: OrganizedTokens, currentToken: Token) => {
    const { collectionName } = currentToken
    if (!accumulator[collectionName]) {
      accumulator[collectionName] = []
    }
    accumulator[collectionName].push(currentToken)

    return accumulator
  }, {})
}

export default function NFTGrid() {
  const [nfts, setNFTs] = useState<OrganizedTokens>({})

  const core = new Core({
    endpointUrl:
      //'https://powerful-autumn-fog.quiknode.pro/da003dc031d0468f868c9b20391a5cbe8873f213/',
      'https://fragrant-burned-lake.quiknode.pro/01400e769df01c1c6f5c44a66ea39abd7db9f4d6/',
    config: {
      addOns: {
        nftTokenV2: true,
      },
    },
  })

  // Define your collections here
  const collections = [
    '0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95',
    '0xbd3531da5cf5857e7cfaa92426877b022e612cf8',
    '0x1e988ba4692e52bc50b375bcc8585b95c48aad77',
    '0x524cab2ec69124574082676e6f654a18df49a048',
    '0x5946aeaab44e65eb370ffaa6a7ef2218cff9b47d',
  ]

  async function fetchNFTsForCollection(collection: string) {
    try {
      const res = await core.client.qn_fetchNFTsByCollection({ collection })
      return res.tokens || []
    } catch (error) {
      console.error('Error fetching NFTs for collection:', collection, error)
      return []
    }
  }

  async function fetchAndOrganizeNFTs() {
    try {
      // const allNFTsPromises = collections.map(fetchNFTsForCollection)
      // const allNFTsResults = await Promise.all(allNFTsPromises)
      const allNFTsResults = nftList
      const allNFTs = allNFTsResults.flat().filter((nft) => nft.imageUrl)
      const organizedNFTs = organizeNFTsByCollection(allNFTs)
      setNFTs(organizedNFTs)
    } catch (error) {
      console.error('Error fetching or organizing NFTs:', error)
    }
  }

  useEffect(() => {
    fetchAndOrganizeNFTs()
  }, [])

  return (
    <Tabs defaultValue="Fabrica Land" className="w-full py-4">
      {/* Just remove the hidden class when ready to show collection names as tabs. */}
      <TabsList className="mx-auto my-4 hidden w-full bg-transparent">
        {Object.keys(nfts).map((collectionName) => (
          <TabsTrigger key={collectionName} value={collectionName}>
            {collectionName}
          </TabsTrigger>
        ))}
      </TabsList>

      {Object.entries(nfts).map(([collectionName, collectionNFTs]) => (
        <TabsContent key={collectionName} value={collectionName}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {collectionNFTs.map((nft, index) => (
              <NFTCard key={index} nft={nft} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export interface NFTResults {
  collection: string
  tokens: Token[]
  totalPages: number
  pageNumber: number
  totalItems: number
}

export interface Token {
  collectionName: string
  collectionAddress: string
  collectionTokenId: string
  description: string
  name: string
  imageUrl: string
  traits: Trait[]
  chain: string
  network: string
}

export interface Trait {
  value: number | string
  trait_type: string
  display_type?: string
}
