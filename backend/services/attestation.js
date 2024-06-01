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
    private_key
) {
    console.log(encodeDataItems, 'encodeDataItems')
    try {
        const schemaInfo = await getSchemaRecord(schemaUID)
        const easContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
        const provider = ethers.getDefaultProvider( // TODO: change to Infura as it is Alchemy and it is throttled
            "sepolia"
        )
        const signer = new ethers.Wallet(private_key, provider) //.Wallet(process.env.ATTEST_PRIV_KEY
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
                ...(referencedAttestationUID && { referencedAttestation: referencedAttestationUID }),
            },
        }
        // Create attestation
        const tx = await eas.attest(attestationData, { gasLimit: 10000000 })
        const newAttestationUID = await tx.wait()
        console.log("New attestation UID:", newAttestationUID)
        const explorerUrl = 'https://sepolia.easscan.org/attestation/view/' + newAttestationUID
        console.log('Explorer URL:', explorerUrl)
        return newAttestationUID
    } catch (error) {
        console.error("Error creating attestation:", error)
        throw error // Propagate error for further handling if necessary
    }
}

module.exports = {
    createAttestation
}
