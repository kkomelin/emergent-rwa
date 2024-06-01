const { EAS, SchemaEncoder } = require("@ethereum-attestation-service/eas-sdk")
const { ethers } = require('ethers')
const { getSchemaRecord } = require('./schema.js')
require('dotenv').config()

async function createAttestation(
    schemaUID,
    encodeDataItems,
    recipient,
    expirationTime,
    revocable,
    referencedAttestationUID,
    privateKey,
    network = 'sepolia'
) {
    try {
        const schemaInfo = await getSchemaRecord(schemaUID)
        const easContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
        // const provider = ethers.getDefaultProvider(network)
        // const provider = new ethers.InfuraProvider(network, process.env.INFURA_API_KEY)
        const provider = new ethers.AlchemyProvider(network, process.env.ALCHEMY_API_KEY)
        const signer = new ethers.Wallet(privateKey, provider)
        console.log('Signer address:', signer.address)
        const eas = new EAS(easContractAddress).connect(signer)
        const schemaEncoder = new SchemaEncoder(schemaInfo.schema)
        const encodedData = schemaEncoder.encodeData(
            encodeDataItems
        )
        const attestationData = {
            schema: schemaUID,
            data: {
                data: encodedData,
                ...(recipient && { recipient }),
                ...(expirationTime && { expirationTime }),
                ...(typeof revocable !== 'undefined' && { revocable }),
                ...(referencedAttestationUID && { referencedAttestation: referencedAttestationUID })
            }
        }
        console.log('Submitting transaction...')
        const tx = await eas.attest(attestationData, { gasLimit: 10000000 })
        const newAttestationUID = await tx.wait()
        return newAttestationUID
    } catch (error) {
        console.error('Error creating attestation:', error)
        throw error
    }
}

module.exports = {
    createAttestation
}
