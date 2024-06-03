// This bot sends attestations to target NFTs
require('dotenv').config()
const { get } = require('http')
const { createAttestation } = require('./services/attestation')
const { getSchemaRecord, registerSchema, getOurSchemas, createSchema } = require('./services/schema')
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const ethers = require('ethers')

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


const buildEncodedData = (schema) => {
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
    // Data:
    //
    // Owner: https://opensea.io/0xFCaAAB590fC876ef9be2D00178e9C78A4Edab825
    // Land NFTs:
    // Both:
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
                        value = 'John Doe says'
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
        console.log("Done. Attestation UID:", attestationUid)
        const explorerUrl = 'https://' + network + '.easscan.org/attestation/view/' + attestationUid
        console.log('Explorer URL:', explorerUrl)
        console.log('----')
        console.log("Waiting 10 seconds before creating another attestation...")
        await sleep(10000)
    }
}

/// @dev Calculates a UID for a given schema.
/// @param schemaRecord The input schema.
/// @return schema UID.
function getUID(schemaRecord) {
    const abiCoder = new ethers.AbiCoder()
    const hash = ethers.solidityPackedKeccak256(
        ['string', 'address', 'bool'],
        [schemaRecord.schema, schemaRecord.resolver, schemaRecord.revocable]
    )
    console.log(schemaRecord, 'Schema UID:', hash)
    return hash
}

const attestSchemas = async (network, iterations) => {
    const schemaUids = [
        // The come from hashes of the schema strings so they are consistent across networks
        // TODO: double check that!
        '0x8bfde2238759364dafafc3e0270cd7879a3594ff89806849f4049d7c7ae3c312', // IS_IN_NATURE_RESERVE
        '0x51c0bb1e9fa902609016c26f3d02890439a857a7a049d5ae468c2ec7eca86ba5'  // IS_BUILDING_PERMITTED
    ]
    let total = 0
    for (let schemaUid of schemaUids) {
        await attest(network, schemaUid, iterations)
        total++
    }
    console.log('Done. Attested', iterations, 'attestations for each schema on', network, 'for a total of', total, 'attestations')
}

getSchemaByName = (name) => {
    const schemas = [
        { schema: 'bool isLawyer', resolver: '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0', revocable: true },
        { schema: 'uint256 WILL_PAY_AMOUNT', resolver: '0x270602dAb469431ad995bB424e7e1CD0A5e3E5e6', revocable: true },
        { schema: 'bool IS_IN_NATURE_RESERVE,string SUPPORTING_URL,string TARGET_CHAIN,string TARGET_ADDRESS,string TARGET_ID', resolver: '', revocable: true },
        { schema: 'bool IS_BUILDING_PERMITTED,string SUPPORTING_URL,string TARGET_CHAIN,string TARGET_ADDRESS,string TARGET_ID', resolver: '', revocable: true }
    ]
    const schemaRecord = schemas.find(schema => schema.schema.includes(name))
    if (!schemaRecord) {
        throw new Error('Schema not found')
    }
    return {
        schema: schemaRecord.schema,
        resolver: schemaRecord.resolver,
        revocable: schemaRecord.revocable
    }
}

const createRecipes = async (targetNetwork) => {
    // recipes are lists of attestations
    // we will get them from the schema registry on source nework and then create them on the target network
    // https://sepolia.easscan.org/schema/view/0xb8d7b7f2ea6f5e2086c5388a833175552f56c93f4e804a0e8223cfbdb07be614
    // https://linea.easscan.org/schema/view/0x5a16a66d354e9302bd148c896ceca134830de7ecdc13f8a0e46d27057fd3160c

    const recipes = [
        {
            expectedOutcome: 'You will be able to sell the house in Denver',
            attestations: [
                {
                    schema: getSchemaByName('isLawyer').schema,
                    schemaUid: getUID(getSchemaByName('isLawyer'))
                },
                {
                    schema: getSchemaByName('WILL_PAY_AMOUNT'),
                    schemaUid: getUID(getSchemaByName('WILL_PAY_AMOUNT'))
                }
            ]
        }
    ]

    const sourceNetwork = 'sepolia'
    for (let recipe of recipes) {
        // console.log('Creating recipe:', recipe.expectedOutcome)
        // for (let attestation of recipe.attestations) {
        //     console.log('Attesting schema:', attestation.schema)
        //     await attest(sourceNetwork, attestation.schemaUid, 1)
        // }
        for (let attestation of recipe.attestations) {
            console.log('Fetcing onchain schema:', attestation.schemaUid)
            const onchainSchema = await getSchemaRecord(attestation.schemaUid, sourceNetwork)
            console.log('onchainSchema:', onchainSchema)
            // console.log('Attesting schema:', attestation.schema)
            // await attestSchemas(sourceNetwork, 1)
        }
    }
    // const recipeSchema = '0xb8d7b7f2ea6f5e2086c5388a833175552f56c93f4e804a0e8223cfbdb07be614'
    // create a recipe on the target network
}

const getDeployedSchemaRecords = async (network) => {
    const schemaUids = [
        // These are land-related schemas
        '0x2a8579c182fc9c021be463079da9fddca39b71b74c0a2393240c678fff22cf7b',
        '0xfc2ce1d850f72510512ead2aaf02add50204b36c0815e4f887255c30fd3fab7e',
        '0x404321ab2a67608b42f546bea05f40a1f00eed239fd2060a65762637bf45aa55',
        '0x782536bb014ff75f322af240b3d7d7d9b2f64327ce164b27c25f595fa0a56f79',
        '0x4ce1d6ff9afbaefc790c6f692420f2b6d06790de7e3cde4d9bf8b4f1cf842604'
    ]
    for (let schemaUid of schemaUids) {
        const schema = await getSchemaRecord(schemaUid, network)
        console.log('Schema:', schema)
    }

}

// registerSchemas('optimism-sepolia')
// registerSchemas('linea')
// attestSchemas('optimism-sepolia', 10)
// attestSchemas('linea', 10)
// createRecipes('optimism-sepolia')
// getDeployedSchemaRecords('sepolia')

const main = async () => {
    const schemaRecord = {
        schema: 'bool IS_FREEHOLD,string SUPPORTING_URL,string TARGET_CHAIN,string TARGET_ADDRESS,string TARGET_ID',
        resolver: '0x0000000000000000000000000000000000000000',
        revocable: true
    }
    await createSchema(schemaRecord, 'linea')
}

main()