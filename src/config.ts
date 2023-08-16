import { config } from "dotenv"
import { ethers } from "ethers"
import abi from "./wormhole-abi.json"
import idl from "./wormhole-idl.json"
import { Connection } from "@solana/web3.js"
import { AnchorProvider, setProvider } from "@project-serum/anchor"
config()

export const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY as string
export const SOL_PRIVATE_KEY = process.env.SOL_PRIVATE_KEY as string

export const publicEthClient = (chainId: number) => {
    const rpcUrls: { [key: number]: string } = {
        2: "https://rpc.ankr.com/eth",
        5: "https://rpc.ankr.com/polygon"
    }

    return ethers.getDefaultProvider(rpcUrls[chainId])
}

export const publicSolClient = () => {
    const connection = new Connection("https://solana-mainnet.g.alchemy.com/v2/LZLe8tHrIZ06MnZlxn-L4Fo5aj7iIdgI")

    setProvider(AnchorProvider.local())

    return connection
}

export const WORMHOLE_RELAYER_ABI = abi
export const WORMHOLE_RELAYER_IDL = idl

export const getWormholeRelayerAddress = (chainId: number) => {
    const addresses: any = {
        1: "worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth",
        2: "0x3ee18B2214AFF97000D974cf647E7C347E8fa585",
        5: "0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE"
    }

    return addresses[chainId]
}