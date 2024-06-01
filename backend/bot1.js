// This bot sends attestations to target NFTs
// Owner: https://opensea.io/0xFCaAAB590fC876ef9be2D00178e9C78A4Edab825
// Land NFTs:

// Old and New:
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/18174272903809786939
//
// New:
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/12328972520998953412
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/14544113128183520803
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/17856012520727249520
// 
// Old:
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/216358582526726280
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/4268287482671028907
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/869376724961328283
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/1296266066083239167
// https://opensea.io/assets/ethereum/0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95/5858922566235109733
// load dotenv
require('dotenv').config()
const { createAttestation } = require('./services/attestation')
const { getSchemaRecord, registerSchema, getOurSchemas } = require('./services/schema')

const registerSchemas = async (network) => {
    const schemas = await getOurSchemas()
    console.log('We will register', schemas.length, 'schemas on', network)
    let counter = 0
    for (let schema of schemas) {
        const res = await registerSchema(schema, null, network)
        counter += res ? 1 : 0
    }
    console.log('Successfully registered', counter, 'out of', schemas.length, 'schemas on', network)
}


const main = async () => {
    while (true) {
        console.log("Creating a random attestation...")
        const recipient = '0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95'
        const schemaUID = '0x782536bb014ff75f322af240b3d7d7d9b2f64327ce164b27c25f595fa0a56f79'
        // const schema = await getSchemaRecord(schemaUID)
        const revocable = false
        const referencedAttestationUID = null
        const expirationTime = 0
        const network = 'sepolia'

        const encodedData = [
            { name: "IS_IN_NATURE_RESERVE", value: 1, type: "bool" },
            { name: "SUPPORTING_URL", value: "X", type: "string" },
            { name: "TARGET_CHAIN", value: "Ethereum", type: "string" },
            { name: "TARGET_CONTRACT", value: "0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95", type: "string" },
            { name: "TARGET_ID", value: "18174272903809786939", type: "string" }
        ]
        const attestationUid = await createAttestation(
            schemaUID,
            encodedData,
            recipient,
            expirationTime,
            revocable,
            referencedAttestationUID,
            process.env.PRIVATE_KEY_6,
            network
        )
        console.log("Attestation UID:", attestationUid)
        const explorerUrl = 'https://sepolia.easscan.org/attestation/view/' + attestationUid
        console.log('...Done. Explorer URL:', explorerUrl)
        console.log('----')
        console.log("Waiting 10 seconds before creating another attestation...")
        await new Promise(r => setTimeout(r, 10000));
    }
}

// main()

registerSchemas('sepolia')