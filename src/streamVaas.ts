import { createSpyRPCServiceClient, subscribeSignedVAA } from  "@certusone/wormhole-spydk"
import { parse } from "./vaa"
import { addPendingVaa, setupRedis } from "./storage"
import { parseAndValidate } from "./parseAndValidateVaas"

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
        const parsedVaa = parse(vaa.vaaBytes)
        console.log("Recevied vaa --> ", parsedVaa.emitterAddress)

        if(parsedVaa.signatures[parsedVaa.signatures.length - 1].guardianSetIndex >= 17 && (parsedVaa.payload as any).chain == 5) {
            console.log("Correct VAA")
            // const { pendingQueue } = setupRedis()
            // await addPendingVaa(pendingQueue, vaa.vaaBytes)

            try {
                const { tx } = await parseAndValidate(vaa.vaaBytes)
    
                console.log("Relayed successfully --> ", tx)
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log("Not correct VAA")
        }
    }
}