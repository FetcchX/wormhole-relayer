import { Other, Payload, VAA } from "../vaa";
import { relayEthereum } from "./ethereum";
import { relaySolana } from "./solana";

export interface Chain { chain: string, chainId: number, rpc: string, type: "EVM" | "SOLANA" | "COSMOS" }

export const getWormholeChainDetails = (chainId: number): Chain | undefined => {
    const chains: Chain[] = []

    return chains.find(chain => chain.chainId === chainId)
}

export const relay = async (vaa: VAA<Payload | Other>) => {
    const payload: any = vaa.payload
    const toChain = getWormholeChainDetails(payload.chain)!

    if(toChain.type === "EVM") {
        const tx = await relayEthereum(vaa)
    } else if (toChain.type === "SOLANA") {
        const tx = await relaySolana(vaa)
    } else {
        throw new Error("Chain not supported for relay")
    }
}