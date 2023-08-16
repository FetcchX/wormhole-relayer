import { postVaaSolanaWithRetry } from "@certusone/wormhole-sdk"
import { Other, Payload, VAA } from "../vaa"
import { SOL_PRIVATE_KEY, getWormholeRelayerAddress, publicSolClient } from "../config"
import { createPostSignedVaaTransactions } from "@certusone/wormhole-sdk/lib/cjs/solana/sendAndConfirmPostVaa"
import { Keypair, PublicKey } from "@solana/web3.js"
import { base58 } from "ethers/lib/utils"

export const relaySolana = async (vaa: VAA<Payload | Other>, vaaBytes: Buffer) => {
    console.log('relaying to ethereum')
    try {
        const connection = publicSolClient()
        const programId = getWormholeRelayerAddress(vaa.emitterChain)
        const wallet = Keypair.fromSecretKey(base58.decode(SOL_PRIVATE_KEY))
        // const pubKey = new PublicKey(wallet)
        
        // const signedTx = await createPostSignedVaaTransactions(connection, programId, wallet, vaaBytes, "confirmed")
    
        const txs = await  postVaaSolanaWithRetry(connection, async (transaction) => {
            transaction.partialSign(wallet);
            return transaction;
        }, programId, wallet, vaaBytes, 2, "confirmed")
    
        return txs
    } catch (e) {
        console.log(e, "error on solana")
        throw e
    }
}