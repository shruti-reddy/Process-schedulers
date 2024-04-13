import { MinPriorityQueue } from "@datastructures-js/priority-queue";

class Job {
    name;
    arrivalTime;
    burstTime;
}

function shortestJobFirst(processes) {
    const n = processes.length;
    if (n <= 1) return 0;
    let jobs = [];
    for (let i = 0; i < n; i++) {
        jobs[i] = new Job(processes[i].name, processes[i].arrivalTime, processes[i].burstTime);
    }
    // sort jobs based on arrival
    jobs.sort((a, b) => a.arrival - b.arrival);

    // min priority queue to get shortest job
    const readyJobs = new MinPriorityQueue((a, b) => a.burst - b.burst);
    // PriorityQueue < Job > readyJobs = new PriorityQueue < Job > ((a, b) => a.burst - b.burst);

    let totalWaitTime = 0;
    let currentTime = jobs[0].arrival;
    let i = 0;
    debugger;
    while (i < n) {
        // add jobs that arrived before current time
        while (i < n && currentTime >= jobs[i].arrival) {
            readyJobs.add(jobs[i]);
            i++;
        }
        if (i < n && readyJobs.isEmpty()) {
            let nextJobsArrival = jobs[i].arrival;
            totalWaitTime += (nextJobsArrival - currentTime);
            currentTime = nextJobsArrival;
            continue;
        }
        nextJob = readyJobs.remove();
        totalWaitTime += (currentTime - nextJob.arrival);
        currentTime += nextJob.burst;
    }
    while (!readyJobs.isEmpty()) {
        nextJob = readyJobs.remove();
        totalWaitTime += (currentTime - nextJob.arrival);
        currentTime += nextJob.burst;
    }

    return totalWaitTime / n;

}

export default shortestJobFirst;