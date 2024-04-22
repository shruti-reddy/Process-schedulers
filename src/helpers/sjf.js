import { MinPriorityQueue } from "@datastructures-js/priority-queue";

class Job {
    constructor(name, arrivalTime, burstTime) {
        this.name = name;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
    }
}

function shortestJobFirst(processes) {
    const n = processes.length;
    if (n <= 1) {
        processes[0].waitingTime = processes[0].arrivalTime;
        processes[0].turnAroundTime = processes[0].burstTime;
        processes[0].completionTime = processes[0].arrivalTime + processes[0].burstTime;
        return [processes, 0, processes[0].turnAroundTime]
    };
    let jobs = [];
    for (let i = 0; i < n; i++) {
        jobs[i] = new Job(processes[i].name, processes[i].arrivalTime, processes[i].burstTime);
    }
    // sort jobs based on arrival
    jobs.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // min priority queue to get shortest job
    const readyJobs = new MinPriorityQueue(a => a.burstTime);

    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;
    let currentTime = jobs[0].arrivalTime;
    let outputProcesses = [];
    let i = 0;
    while (i < n) {
        // add jobs that arrived before current time
        while (i < n && currentTime >= jobs[i].arrivalTime) {
            readyJobs.enqueue(jobs[i]);
            i++;
        }
        if (i < n && readyJobs.isEmpty()) {
            let nextJobsArrival = jobs[i].arrivalTime;
            // totalWaitTime += (nextJobsArrival - currentTime);
            currentTime = nextJobsArrival;
            continue;
        }
        const nextJob = readyJobs.dequeue();
        const waitingTime = Math.max(currentTime - nextJob.arrivalTime, 0);
        const turnAroundTime = waitingTime+nextJob.burstTime;
        const completionTime = currentTime + nextJob.burstTime;
        const outputProcess = {...nextJob};
        outputProcess.waitingTime = waitingTime;
        outputProcess.turnAroundTime = turnAroundTime;
        outputProcess.completionTime = completionTime;
        outputProcesses.push(outputProcess);
        totalWaitTime += waitingTime;
        totalTurnaroundTime+=turnAroundTime;
        currentTime += nextJob.burstTime;
    }
    while (!readyJobs.isEmpty()) {
        const nextJob = readyJobs.dequeue();
        const waitingTime = Math.max(currentTime - nextJob.arrivalTime, 0);
        const turnAroundTime = waitingTime+nextJob.burstTime;
        const completionTime = currentTime + nextJob.burstTime;
        const outputProcess = {...nextJob};
        outputProcess.waitingTime = waitingTime;
        outputProcess.turnAroundTime = turnAroundTime;
        outputProcess.completionTime = completionTime;
        outputProcesses.push(outputProcess);
        totalWaitTime += waitingTime;
        totalTurnaroundTime+=turnAroundTime;
        currentTime += nextJob.burstTime;
    }
    const averageWaitingTime = totalWaitTime/n;
    const averageTurnaroundTime = totalTurnaroundTime/n;

    return [outputProcesses, Math.round(averageWaitingTime), Math.round(averageTurnaroundTime)];

}

export default shortestJobFirst;