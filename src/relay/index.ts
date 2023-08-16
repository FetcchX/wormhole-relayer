import { Other, Payload, VAA } from "../vaa";
import { relayEthereum } from "./ethereum";
import { relaySolana } from "./solana";

export interface Chain { chain: string, chainId: number, rpc: string, type: "EVM" | "SOLANA" | "COSMOS" }

export const getWormholeChainDetails = (chainId: number): Chain | undefined => {
    const chains: Chain[] = [
        {
            chain: "polygon",
            chainId: 5,
            rpc: "https://rpc.ankr.com/polygon",
            type: "EVM"
        }
    ]

    return chains.find(chain => chain.chainId === chainId)
}

export const relay = async (vaa: VAA<Payload | Other>, vaaBytes: Buffer) => {
    console.log("relaying", vaa.sequence)
    const payload: any = vaa.payload
    const toChain = getWormholeChainDetails(payload.chain)!

    if(toChain.type === "EVM") {
        const tx = await relayEthereum(vaa, vaaBytes)

        return tx
    } else if (toChain.type === "SOLANA") {
        const tx = await relaySolana(vaa, vaaBytes)

        return tx
    } else {
        throw new Error("Chain not supported for relay")
    }
}