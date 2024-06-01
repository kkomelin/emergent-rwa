import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import NFTCard from './nft-card'
import { Core } from '@quicknode/sdk'

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

  useEffect(() => {
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

        const allNFTsResults = [
          {
            chain: 'Ethereum',
            collectionName: 'Fabrica Land',
            collectionAddress: '0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95',
            collectionTokenId: '12328972520998953412',
            name: "APN 1011020335475100600, Belen, NM",
            imageUrl: "https://api.mapbox.com/styles/v1/fedepo/clcbmvais006t14l3r9y3d0r9/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22stroke%22%3A%22%23ffffff%22%2C%22stroke-width%22%3A3%2C%22stroke-opacity%22%3A1%2C%22fill%22%3A%22%231E28FF%22%2C%22fill-opacity%22%3A0.3%2C%22marker-size%22%3A%22small%22%2C%22marker-color%22%3A%22%231E28FF%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-106.7022279%2C34.5500124%5D%2C%5B-106.702694%2C34.5503087%5D%2C%5B-106.703143%2C34.5498251%5D%2C%5B-106.7026769%2C34.5495288%5D%2C%5B-106.7022279%2C34.5500124%5D%5D%5D%7D%7D)/auto/640x640@2x?access_token=pk.eyJ1IjoiZmVkZXBvIiwiYSI6IjBvWFl3QzQifQ.7pMkZfev4PTvSZWed2UsrA&padding=192&logo=false",
            description: "Possession of this NFT grants full rights to the **real property** in the County of Valencia (NM) described as:\n\n---\n\n`All of Lot 7 in Block 594 in Unit 25 of the Rio Grande Estates Subdivisions according to map thereof recorded in the Office of Clerk of Valencia County, New Mexico excluding any gas, oil, or mineral rights.`\n\n---\n\nThe property has a provenance score of 3122. Detailed information about the property and its score [can be found here](https://app.fabrica.land/property/12328972520998953412).\n\nLegal Title of the property is held in the holding entity *Fabrica NCCMYBX7P7GW8 Trust* linked to this NFT and recorded at the County of Valencia (NM) ([proof of title](https://ipfs.fabrica.land/ipfs/bafkreifcxvxwmljyv4qiby2jtamnbfmcnsug5xhnlcu3wpocsyzscsdxn4)). **By electronically signing a transaction to acquire the NFT, the buyer acknowledges and accepts all terms, duties and liabilities described in the [Operating Agreement](https://ipfs.fabrica.land/ipfs/QmXRQx7wPxSwQDVVr1pTkiwvBHBUd1SYLbLgSn1Bvirqpc)**.",
            title: "APN 1011020335475100600, Belen, NM",
            traits: [],
            network: 'mainnet',
          },
          {
            chain: 'Ethereum',
            collectionName: 'Fabrica Land',
            collectionAddress: '0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95',
            collectionTokenId: '14544113128183520803',
            name: "APN 074-142-22, Zayante, CA",
            imageUrl: "https://api.mapbox.com/styles/v1/fedepo/clcbmvais006t14l3r9y3d0r9/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22stroke%22%3A%22%23ffffff%22%2C%22stroke-width%22%3A3%2C%22stroke-opacity%22%3A1%2C%22fill%22%3A%22%231E28FF%22%2C%22fill-opacity%22%3A0.3%2C%22marker-size%22%3A%22small%22%2C%22marker-color%22%3A%22%231E28FF%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-122.0453564%2C37.0870953%5D%2C%5B-122.0454849%2C37.0871107%5D%2C%5B-122.0456193%2C37.0871268%5D%2C%5B-122.0456637%2C37.0871321%5D%2C%5B-122.045746%2C37.0871653%5D%2C%5B-122.0460074%2C37.0870017%5D%2C%5B-122.0459124%2C37.0869111%5D%2C%5B-122.0458153%2C37.0868183%5D%2C%5B-122.0457375%2C37.0867441%5D%2C%5B-122.0456462%2C37.0866569%5D%2C%5B-122.0456394%2C37.0866615%5D%2C%5B-122.0455482%2C37.0867187%5D%2C%5B-122.0455367%2C37.0867254%5D%2C%5B-122.0455365%2C37.0867255%5D%2C%5B-122.0455364%2C37.0867256%5D%2C%5B-122.0454636%2C37.0867652%5D%2C%5B-122.0453884%2C37.0868017%5D%2C%5B-122.0453109%2C37.0868351%5D%2C%5B-122.0453564%2C37.0870953%5D%5D%5D%7D%7D)/auto/640x640@2x?access_token=pk.eyJ1IjoiZmVkZXBvIiwiYSI6IjBvWFl3QzQifQ.7pMkZfev4PTvSZWed2UsrA&padding=192&logo=false",
            description: "Possession of this NFT grants full rights to the **real property** in the County of Santa-Cruz (CA) described as:\n\n---\n\n`Lots 37, 38 and 39 in Block 12, as shown and delineated on Zayante Lakes Subdivision No. 4 filed for record in Map Book 25 Page 3 Santa Cruz County Records.`\n\n---\n\nThe property has a provenance score of 3142. Detailed information about the property and its score [can be found here](https://app.fabrica.land/property/14544113128183520803).\n\nLegal Title of the property is held in the holding entity *Fabrica S7BH3N82F5F26 Trust* linked to this NFT and recorded at the County of Santa-Cruz (CA) ([proof of title](https://ipfs.fabrica.land/ipfs/bafkreid4srcipdaulfvyk72v5e65326dsdstiltektwz3zijm32gunyo6i)). **By electronically signing a transaction to acquire the NFT, the buyer acknowledges and accepts all terms, duties and liabilities described in the [Operating Agreement](https://ipfs.fabrica.land/ipfs/QmXRQx7wPxSwQDVVr1pTkiwvBHBUd1SYLbLgSn1Bvirqpc)**.",
            title: "APN 074-142-22, Zayante, CA",
            traits: [],
            network: 'mainnet',
          },
          {
            chain: 'Ethereum',
            collectionName: 'Fabrica Land',
            collectionAddress: '0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95',
            collectionTokenId: '17856012520727249520',
            name: "7232 Greenleaf Ave, Whittier, CA",
            imageUrl: "https://api.mapbox.com/styles/v1/fedepo/clcbmvais006t14l3r9y3d0r9/static/geojson(%7B%22type%22%3A%22Feature%22%2C%22properties%22%3A%7B%22stroke%22%3A%22%23ffffff%22%2C%22stroke-width%22%3A3%2C%22stroke-opacity%22%3A1%2C%22fill%22%3A%22%231E28FF%22%2C%22fill-opacity%22%3A0.3%2C%22marker-size%22%3A%22small%22%2C%22marker-color%22%3A%22%231E28FF%22%7D%2C%22geometry%22%3A%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-118.037235%2C33.9762045%5D%2C%5B-118.036773%2C33.976204%5D%2C%5B-118.0367725%2C33.9763405%5D%2C%5B-118.0372345%2C33.9763415%5D%2C%5B-118.037235%2C33.9762045%5D%5D%5D%7D%7D)/auto/640x640@2x?access_token=pk.eyJ1IjoiZmVkZXBvIiwiYSI6IjBvWFl3QzQifQ.7pMkZfev4PTvSZWed2UsrA&padding=192&logo=false",
            description: "Possession of this NFT grants full rights to the **real property** in the County of Los-Angeles (CA) described as:\n\n---\n\n`LOT 18, IN BLOCK 29, OF THE WHITTIER TRACT, IN THE CITY OF WHITTIER, COUNTY OF LOS ANGELES, STATE OF\nCALIFORNIA, AS PER MAP RECORDED IN BOOK 21, PAGES 55 AND 56 OF MISCELLANEOUS MAPS, IN THE OFFICE OF\nTHE COUNTY RECORDER OF SAID COUNTY.`\n\n---\n\nThe property has a provenance score of 3142. Detailed information about the property and its score [can be found here](https://app.fabrica.land/property/17856012520727249520).\n\nLegal Title of the property is held in the holding entity *Fabrica YZ6MSJ2AW0170 Trust* linked to this NFT and recorded at the County of Los-Angeles (CA) ([proof of title](https://ipfs.fabrica.land/ipfs/Qmb5AeQqwwX9xtAkzt4B5McLoCuqt27v5zX6SWVJveuDY7)). **By electronically signing a transaction to acquire the NFT, the buyer acknowledges and accepts all terms, duties and liabilities described in the [Operating Agreement](https://ipfs.fabrica.land/ipfs/Qmf6Aia6gJfRgGyGroYft3kjxsLUhJEhMYVKPKj2JwY41Z)**.",
            title: "7232 Greenleaf Ave, Whittier, CA",
            traits: [],
            network: 'mainnet',
          }
        ]

        const allNFTs = allNFTsResults.flat().filter((nft) => nft.imageUrl)

        const organizedNFTs = organizeNFTsByCollection(allNFTs)
        setNFTs(organizedNFTs)
      } catch (error) {
        console.error('Error fetching or organizing NFTs:', error)
      }
    }

    fetchAndOrganizeNFTs()
  }, [])

  return (
    <Tabs defaultValue="Fabrica Land" className="w-full p-4">
      <TabsList className="mx-auto my-4 w-full bg-transparent">
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
