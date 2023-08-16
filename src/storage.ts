import { parseAndValidate } from "./parseAndValidateVaas"
import { Other, Payload, VAA } from "./vaa"
import { Queue, Worker } from "bullmq"

export enum QueueName {
    PENDING_QUEUE = "PENDING_QUEUE",
    COMPLETED_QUEUE = "COMPLETED_QUEUE"
}

export const setupRedis = () => {
    const pendingQueue = new Queue(QueueName.PENDING_QUEUE)
    const completedQueue = new Queue(QueueName.COMPLETED_QUEUE)

    return {
        pendingQueue,
        completedQueue
    }
}

export const addPendingVaa = async (queue: Queue, data: Buffer) => {
    console.log("adding pending vaa")
    return queue.add(QueueName.PENDING_QUEUE, data)
}

export const addCompletedVaa = async (queue: Queue, vaa: VAA<Payload | Other>, relayedTx: any) => {
    console.log("adding completed vaa")
    return queue.add(QueueName.COMPLETED_QUEUE, {
        vaa,
        relayedTx
    })
}