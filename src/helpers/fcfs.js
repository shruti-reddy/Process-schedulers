function calculateOutputForFCFS() {
    this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Initialize variables to store waiting time, turnaround time, and completion time
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let completionTime = 0;

    // Iterate through the processes to calculate waiting time, turnaround time, and completion time
    this.processes.forEach(process => {
        // Calculate waiting time for the current process
        const waitingTime = Math.max(completionTime - process.arrivalTime, 0);

        // Calculate turnaround time for the current process
        const turnaroundTime = waitingTime + process.burstTime;

        // Update total waiting time and turnaround time
        totalWaitingTime += waitingTime;
        totalTurnaroundTime += turnaroundTime;

        // Update completion time
        completionTime = Math.max(completionTime, process.arrivalTime) + process.burstTime;

        const outputProcess = { ...process };
        outputProcess['waitingTime'] = waitingTime,
        outputProcess['turnAroundTime'] = turnaroundTime;
        outputProcess['completionTime'] = completionTime;
        this.outputProcesses.push(outputProcess);;
    });

    // Calculate average waiting time and turnaround time
    const averageWaitingTime = totalWaitingTime / this.processes.length;
    const averageTurnaroundTime = totalTurnaroundTime / this.processes.length;
}

export default calculateOutputForFCFS;