import { Worker } from "bullmq";
import { parseAndValidate } from "./parseAndValidateVaas";
import { QueueName, addCompletedVaa, setupRedis } from "./storage";
import { stream } from "./streamVaas";

const pendingQueueWorker = new Worker(QueueName.PENDING_QUEUE, async (job) => {
    console.log("starting pending worker")
    const data: Buffer = job.data

    const {
        parsedVaa,
        tx
    } = await parseAndValidate(data)

    const { completedQueue } = setupRedis()

    await addCompletedVaa(completedQueue, parsedVaa, tx)
    console.log("finished pending worker")
})

stream().then()
