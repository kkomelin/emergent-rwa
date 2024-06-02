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
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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

// Schemas are strings of this format:
// bool IS_IN_NATURE_RESERVE,string SUPPORTING_URL,string TARGET_CHAIN,string TARGET_ADDRESS,string TARGET_ID
// For the schema above we need to output an object in this format:
// [
//      { name: 'IS_IN_NATURE_RESERVE', type: 'bool', value: 1},
//      { name: 'SUPPORTING_URL', type: 'string', value: 'X'},
//      { name: 'TARGET_CHAIN', type: 'string', value: 'Ethereum'},
//      { name: 'TARGET_CONTRACT', type: 'string', value: '0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95'},
//      { name: 'TARGET_ID', type: 'string', value: '18174272903809786939'}
// ]
//
const buildEncodedData = (schema) => {
    const targetIds = [
        '18174272903809786939',
        '12328972520998953412',
        '14544113128183520803',
        '17856012520727249520'
    ]

    const schemaItems = schema.split(',')
    const encodedData = []
    for (let item of schemaItems) {
        const [type, name] = item.split(' ')
        let value
        switch (type) {
            case 'bool':
                // randomly assign true or false
                value = Math.random() < 0.5 ? 0 : 1
                break
            case 'string':
            case 'bytes32':
                switch (name) {
                    case 'SUPPORTING_URL':
                        value = 'https://www.ipfs.io/ipfs/' + Math.random().toString(36).substring(7)
                        break
                    case 'TARGET_CHAIN':
                        value = 'Ethereum'
                        break
                    case 'TARGET_ADDRESS':
                        value = '0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95'
                        break
                    case 'TARGET_ID':
                        // random target id
                        value = targetIds[Math.floor(Math.random() * targetIds.length)]
                        break
                    default:
                        value = 'John Does says'
                }
                break
            case 'uint256':
            case 'uint8':
                value = Math.floor(Math.random() * 100)
                break
            default:
                value = 'Claim truth'
        }
        encodedData.push({ name, type, value })
    }
    return encodedData
}


const attest = async (network = 'sepolia', schemaUid, iterations) => {
    for (let i = 0; i < iterations; i++) {
        console.log('Creating a random attestation of schema', schemaUid, 'on', network)
        const recipient = '0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95'
        const schema = await getSchemaRecord(schemaUid, network)
        console.log('Schema:', schema.schema)
        const revocable = false
        const referencedAttestationUID = null
        const expirationTime = 0

        const encodedData = buildEncodedData(schema.schema)
        console.log('Encoded data:', encodedData)
        // [
        //     { name: "IS_IN_NATURE_RESERVE", value: 1, type: "bool" },
        //     { name: "SUPPORTING_URL", value: "X", type: "string" },
        //     { name: "TARGET_CHAIN", value: "Ethereum", type: "string" },
        //     { name: "TARGET_CONTRACT", value: "0x5cbeb7a0df7ed85d82a472fd56d81ed550f3ea95", type: "string" },
        //     { name: "TARGET_ID", value: "18174272903809786939", type: "string" }
        // ]
        const attestationUid = await createAttestation(
            schemaUid,
            encodedData,
            recipient,
            expirationTime,
            revocable,
            referencedAttestationUID,
            process.env.PRIVATE_KEY_6,
            network
        )
        console.log("Attestation UID:", attestationUid)
        const explorerUrl = 'https://' + network + '.easscan.org/attestation/view/' + attestationUid
        console.log('...Done. Explorer URL:', explorerUrl)
        console.log('----')
        console.log("Waiting 10 seconds before creating another attestation...")
        await new Promise(r => setTimeout(r, 10000));
    }
}

const attestSchemas = async (network, iterations) => {
    const schemaUids = [
        '0x51c0bb1e9fa902609016c26f3d02890439a857a7a049d5ae468c2ec7eca86ba5',
        '0x8bfde2238759364dafafc3e0270cd7879a3594ff89806849f4049d7c7ae3c312'
    ]
    for (let schemaUid of schemaUids) {
        await attest(network, schemaUid, iterations)
    }
}



// registerSchemas('optimism-sepolia')
attestSchemas('optimism-sepolia', 10)