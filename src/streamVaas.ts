import { createSpyRPCServiceClient, subscribeSignedVAA } from  "@certusone/wormhole-spydk"
import { parse } from "./vaa"

export const stream = async () => {
    const client = createSpyRPCServiceClient("localhost:7073")
    const vaas = await subscribeSignedVAA(client, {
        filters: [
            {
                emitterFilter: {
                    chainId: 1,
                    emitterAddress: "ec7372995d5cc8732397fb0ad35c0121e0eaa90d26f828a534cab54391b3a4f5"
                }
            }
        ]
    })

    for await (const vaa of vaas) {
        console.log("Recevied vaa --> ", parse(vaa.vaaBytes))
    }
}

stream().then()