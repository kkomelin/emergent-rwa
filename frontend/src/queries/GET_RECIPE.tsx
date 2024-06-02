import { gql } from '@apollo/client'

export const GET_RECIPE = gql`
  query Recipe($recipeId: String!) {
    attestations(
      take: 1
      skip: 0
      where: {
        schemaId: {
          equals: "0xb8d7b7f2ea6f5e2086c5388a833175552f56c93f4e804a0e8223cfbdb07be614"
        }
        id: { equals: $recipeId }
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

export const GET_RECIPE_ATTESTATIONS = gql`
  query RecipeAttestations(
    $schemaId: String!
    $take: Int! = 25
    $skip: Int! = 0
  ) {
    attestations(
      take: $take
      skip: $skip
      where: { schemaId: { equals: $schemaId } }
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
