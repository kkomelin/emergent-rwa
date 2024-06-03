const { SchemaRegistry } = require("@ethereum-attestation-service/eas-sdk")
const { ethers } = require('ethers')
const { get } = require("http")
require('dotenv').config()

// This is the definition of schemas we are actually using
// Source: https://docs.google.com/document/d/1-DAiJ0lxO9JCTpHz3NgLpwhNlXVi5R7L761POVNohkM/edit
// TODO: instead of definitions below maybe use the schema UIDs from reference chain (Sepolia?),
// fetch them, then use them?
const ourSchemas = [
    // Recipe
    "string EXPECTED_OUTCOME,bytes32[] SCHEMA_ID",
    // Identity/Reputation
    "string MY_NAME_IS",
    "bool THIS_ATTESTATION_IS_TRUE", // refAUID should be entered
    // Land (recipient should be same as TARGET_ADDRESS)
    "bool IS_IN_NATURE_RESERVE,string SUPPORTING_URL,string TARGET_CHAIN,string TARGET_ADDRESS,string TARGET_ID",
    "bool IS_BUILDING_PERMITTED,string SUPPORTING_URL,string TARGET_CHAIN,string TARGET_ADDRESS,string TARGET_ID",
    // Marketplace (recipient should be same as TARGET_ADDRESS)
    "bytes32 I_WILL_PAY_FOR_SUID,uint256 AMOUNT,string CURRENCY,string TARGET_CHAIN,string TARGET_ADDRESS,string TARGET_ID",
    "bytes32 I_WILL_DO_SUID,uint256 AMOUNT,string CURRENCY,string TARGET_CHAIN,string TARGET_ADDRESS,string TARGET_ID",
    "bytes32 I_ACCEPT_AUID", // (recipient should be same as target AUID creator)
    "bytes32 I_CONFIRM_DONE_AUID,uint8 REVIEW_SCORE,string REVIEW_TEXT" // (recipient should be same as target AUID creator)
]

async function getOurSchemas() {
    return ourSchemas
}

async function registerSchema(schema, resolver, network = 'sepolia') {
    console.log('Registering schema:', schema)
    try {
        // const provider = new ethers.AlchemyProvider(network, process.env.ALCHEMY_API_KEY)
        const provider = new ethers.InfuraProvider(network, process.env.INFURA_API_KEY)
        const signer = new ethers.Wallet(process.env.FROM_PRIV_KEY, provider)
        console.log('Signer address:', signer.address)
        const schemaRegistryContractAddress = getEASContracts(network).schemaRegistryContractAddress
        const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress)
        const connectedSchemaRegistry = schemaRegistry.connect(signer)
        const resolverAddress = resolver // must not be null!
        const revocable = false // A flag allowing an attestation to be revoked
        const transaction = await connectedSchemaRegistry.register({
            schema: schema,
            revocable: revocable,
            // resolverAddress: resolverAddress
        }, { gasLimit: 1_000_000 })
        // Wait for transaction to be validated
        const res = await transaction.wait()
        console.log('New Schema created on', network)
        const explorerUrl = 'https://' + network + '.easscan.org/schema/view/' + res
        console.log('Explorer URL:', explorerUrl)
        return res
    } catch (error) {
        if ((error.code == 'CALL_EXCEPTION') && (error.shortMessage == 'transaction execution reverted')) {
            console.error('Error: not sure, but probably an identical schema already exists. They are unique by structure.')
            return null
        }
        console.error('An unexpected error occurred:', error)
    }
}

/*
From https://docs.attest.org/docs/quick--start/contracts
Linea:
    EAS
    Contract Address: 0xaEF4103A04090071165F78D45D83A0C0782c2B2a
    SCHEMAREGISTRY
    Contract Address: 0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797
Linea Goerli:
    EAS
    Contract Address: 0xaEF4103A04090071165F78D45D83A0C0782c2B2a
    SCHEMAREGISTRY
    Contract Address: 0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797
Mainnet Sepolia:
    EAS
    Contract Address: 0xC2679fBD37d54388Ce493F1DB75320D236e1815e
    SCHEMAREGISTRY
    Contract Address: 0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0
Optimism sepolia:
    EAS
    Contract Address: [0x4200000000000000000000000000000000000021()
    SCHEMAREGISTRY
    Contract Address: 0x4200000000000000000000000000000000000020
*/
const getEASContracts = (network) => {
    switch (network) {
        case 'sepolia':
            return {
                easContractAddress: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
                schemaRegistryContractAddress: '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0'
            }
        case 'linea':
            return {
                easContractAddress: '0xaEF4103A04090071165F78D45D83A0C0782c2B2a',
                schemaRegistryContractAddress: '0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797'
            }
        case 'linea-goerli':
            return {
                easContractAddress: '0xaEF4103A04090071165F78D45D83A0C0782c2B2a',
                schemaRegistryContractAddress: '0x55D26f9ae0203EF95494AE4C170eD35f4Cf77797'
            }
        case 'optimism-sepolia':
            return {
                easContractAddress: '0x4200000000000000000000000000000000000021',
                schemaRegistryContractAddress: '0x4200000000000000000000000000000000000020'
            }
        default:
            throw new Error("Network not recognized")
    }
}

// Translate the network into the lingo used by Alchemy
const mapNetworkToAlchemy = (network) => {
    switch (network) {
        case 'sepolia':
            return 'mainnet-sepolia'
        default:
            return network
    }
}

// Translate the network into the lingo used by the particular provider and return the provider
const getProvider = (network) => {
    const providerName = 'Infura' // 'Alchemy'
    switch (providerName) {
        case 'Infura':
            return new ethers.InfuraProvider(network, process.env.INFURA_API_KEY)
        case 'Alchemy':
            network = mapNetworkToAlchemy(network)
            return new ethers.AlchemyProvider(network, process.env.ALCHEMY_API_KEY)
        default:
            throw new Error("Provider not recognized")
    }
}

async function getSchemaRecord(schemaUID, network = 'sepolia') {
    try {
        const provider = getProvider(network)
        const schemaRegistryContractAddress = getEASContracts(network).schemaRegistryContractAddress
        const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress)
        const connectedSchemaRegistry = schemaRegistry.connect(provider)
        const schemaInfo = await connectedSchemaRegistry.getSchema({ uid: schemaUID })
        return schemaInfo
    } catch (error) {
        console.error('An error occurred fetching schema', schemaUID, 'on', network)
        console.error(error)
    }
}

async function createSchema(schemaRecord, network) {
    try {
        const provider = getProvider(network)
        const privateKey = process.env.PRIVATE_KEY_6
        const signer = new ethers.Wallet(privateKey, provider)
        const schemaRegistryContractAddress = getEASContracts(network).schemaRegistryContractAddress
        const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress)
        const connectedSchemaRegistry = schemaRegistry.connect(signer)
        const transaction = await connectedSchemaRegistry.register(
            {
                schema: schemaRecord.schema,
                resolverAddress: schemaRecord.resolver,
                revocable: schemaRecord.revocable
            },
            { gasLimit: 1_000_000 }
        )
        const res = await transaction.wait()
        console.log('New Schema created on', network)
        const explorerUrl = 'https://' + network + '.easscan.org/schema/view/' + res
        console.log('Explorer URL:', explorerUrl)
        return res
    } catch (error) {
        if ((error.code == 'CALL_EXCEPTION') && (error.shortMessage == 'transaction execution reverted')) {
            console.error('Error: not sure, but probably an identical schema already exists. They are unique by structure.')
            return null
        }
        console.error('An unexpected error occurred:', error)
    }

}

module.exports = {
    getSchemaRecord,
    registerSchema,
    getOurSchemas,
    getEASContracts,
    createSchema
}