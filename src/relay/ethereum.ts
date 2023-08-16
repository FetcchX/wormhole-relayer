import { ETH_PRIVATE_KEY, WORMHOLE_RELAYER_ABI, getWormholeRelayerAddress, publicEthClient } from "../config";
import { Other, Payload, VAA } from "../vaa";
import { ethers } from "ethers";

export const relayEthereum = async (vaa: VAA<Payload | Other>, vaaBytes: Buffer) => {
    console.log('relaying to ethereum')
    try {

        const rpc = publicEthClient(vaa.emitterChain)
        const wallet = (new ethers.Wallet(ETH_PRIVATE_KEY)).connect(rpc)
    
        const relayerContract = new ethers.Contract(getWormholeRelayerAddress((vaa.payload as any).chain), WORMHOLE_RELAYER_ABI, wallet)
    
        const deliveryTx = await relayerContract.completeTransfer(
            `0x${vaaBytes.toString("hex")}`
        )
    
        await deliveryTx.wait()
    
        return deliveryTx
    } catch (e) {
        console.log(e, "failed ethereum tx")
        throw e
    }
}