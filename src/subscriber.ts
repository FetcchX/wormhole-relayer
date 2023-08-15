import { parseAndValidate } from "./parseAndValidateVaas"
import { relay } from "./relay"
import { addCompletedVaa } from "./storage"

export const flowForPendingVaas = async (vaa: Buffer) => {
    // parse and validate vaa
    const parsedVaa = await parseAndValidate(vaa)

    // relay it further
    try {
        const relayedTx = await relay(parsedVaa)
    
        await addCompletedVaa(parsedVaa, relayedTx)
    
        console.log("Relayed --> ", relayedTx)
    } catch (e) {
        // retry
    }
}