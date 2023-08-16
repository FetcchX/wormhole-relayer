import { relay } from "./relay"
import { Other, Payload, VAA, parse } from "./vaa"

export const isTokenBridge = (address: string): boolean => {
    const addresses = [
        // POLYGON
        "0x5a58505a96D1dbf8dF91cB21B54419FC36e93fdE".toLowerCase(),
        "0x0000000000000000000000005a58505a96D1dbf8dF91cB21B54419FC36e93fdE".toLowerCase(),

        // ETHEREUM
        "0x3ee18B2214AFF97000D974cf647E7C347E8fa585".toLowerCase(),
        "0x0000000000000000000000003ee18B2214AFF97000D974cf647E7C347E8fa585".toLowerCase(),

        // SOLANA
        "ec7372995d5cc8732397fb0ad35c0121e0eaa90d26f828a534cab54391b3a4f5".toLowerCase(),
        "0xec7372995d5cc8732397fb0ad35c0121e0eaa90d26f828a534cab54391b3a4f5".toLowerCase(),
        "wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb".toLowerCase(),
        "0e0a589e6488147a94dcfa592b90fdd41152bb2ca77bf6016758a6f4df9d21b4".toLowerCase(),
        "0x0e0a589e6488147a94dcfa592b90fdd41152bb2ca77bf6016758a6f4df9d21b4".toLowerCase()
    ]
    
    return addresses.includes(address.toLowerCase())
}

export const isPermittedAddress = (address: string): boolean => {
    // todo: change this
    const supportedAddresses: string[] = [
        // SOLANA
        "DnLgfcztRqALteYhAyDFadhqnU8y8CTp7Ucy2qX2SGz6".toLowerCase(),
        "bde9a2dc5c1a150b225ae1e7df09d6352929f55451b36b3234326eb439e39e43".toLowerCase(),
        "0xbde9a2dc5c1a150b225ae1e7df09d6352929f55451b36b3234326eb439e39e43".toLowerCase(),

        // EVM
        "0x1DCcc9BaF7E8d7A18f948acD467CE016044fC546".toLowerCase(),
        "0x0000000000000000000000001DCcc9BaF7E8d7A18f948acD467CE016044fC546".toLowerCase()
    ]
    
    return supportedAddresses.includes(address.toLowerCase())
}

// {
//     module: 'TokenBridge',
//     type: 'TransferWithPayload',
//     amount: 2000000n,
//     tokenAddress: '0xc6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d61',
//     tokenChain: 1,
//     toAddress: '0x397ad473aee22d1cd2829ea2238cbffa8a61c9d8eea3a1f7ccf20dc14ca78188',
//     chain: 32,
//     fromAddress: '0x8e3edcd61557e75b0cc672aa10520a3a3f4ee3771e1a77a80640c1cf4ee4b64a',
//     payload: '0x7b2262617369635f726563697069656e74223a7b22726563697069656e74223a22633256704d584d7a4d47316a646d526a613274345a3370304e5456726147357a643231354d3255774f484e774d7a52754e486436616e6831227d7d'
//   }

export const parseAndValidate = async (vaa: Buffer): Promise<{parsedVaa: VAA<Payload | Other>, tx: any}> => {
    const parsedVaa = parse(vaa)
    const payload: any = parsedVaa.payload

    console.log("parsed ", parsedVaa.sequence, " validating it now")

    console.log(parsedVaa, isTokenBridge(parsedVaa.emitterAddress), payload.module === "TokenBridge", parsedVaa.payload.type === "Transfer", parsedVaa.payload.type === "TransferWithPayload")
    if(isTokenBridge(parsedVaa.emitterAddress) && payload.module && payload.module === "TokenBridge" && (parsedVaa.payload.type === "Transfer" || parsedVaa.payload.type === "TransferWithPayload")) {
        console.log("validated", parsedVaa.sequence)

        // validate if to/from is our permitted address
        if(isPermittedAddress(payload.toAddress)) {
            console.log("permitted ", payload.address)
            // ready to relay
            const tx = await relay(parsedVaa, vaa)

            return {
                parsedVaa,
                tx
            }
        }

        throw new Error("address is not permitted")
    }

    throw new Error("Vaa not supported")
}