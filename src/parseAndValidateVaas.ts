import { Other, Payload, VAA, parse } from "./vaa"

export const isTokenBridge = (address: string): boolean => {
    return true
}

export const isPermittedAddress = (address: string): boolean => {
    // todo: change this
    const supportedAddresses: string[] = []
    
    return supportedAddresses.includes(address)
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

export const parseAndValidate = async (vaa: Buffer): Promise<VAA<Payload | Other>> => {
    const parsedVaa = parse(vaa)
    const payload: any = parsedVaa.payload

    if(isTokenBridge(parsedVaa.emitterAddress) && payload.module && payload.module === "TokenBridge" && (parsedVaa.payload.type === "Transfer" || parsedVaa.payload.type === "TransferWithPayload")) {
        console.log("validated")

        // validate if to/from is our permitted address
        if(isPermittedAddress(payload.address)) {
            // ready to relay

            return parsedVaa
        }

        throw new Error()
    }

    throw new Error("Vaa not supported")
}