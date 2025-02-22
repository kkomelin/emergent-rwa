import { gql } from '@apollo/client'

export const GET_RECIPES = gql`
  query Recipes($take: Int! = 25, $skip: Int! = 0) {
    attestations(
      take: $take
      skip: $skip
      where: {
        schemaId: {
          equals: "0xb8d7b7f2ea6f5e2086c5388a833175552f56c93f4e804a0e8223cfbdb07be614"
        }
      }
      orderBy: { time: desc }
    ) {
      id
      attester
      recipient
      refUID
      decodedDataJson
    }
  }
`
