function calculateOutputForRR(inputProcesses, quantum) {
    // Sort processes based on arrival time
    const processes = inputProcesses.map(p => ({...p}));
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const n = processes.length;
    const burstRemaining = processes.map(p => p.burstTime);
    const waitingTime = new Array(n).fill(0);
    const completionTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    let outputProcesses = [];

    let currentTime = processes[0].arrivalTime;
    const quantumExecutionArray = []; // Store the execution order with start and end times

    while (true) {
        let done = true;

        for (let i = 0; i < n; i++) {
            if (burstRemaining[i] > 0 && processes[i].arrivalTime <= currentTime) {
                done = false;

                const currentProcess = processes[i].id;

                const startTime = currentTime;
                if (burstRemaining[i] > quantum) {
                    currentTime += quantum;
                    burstRemaining[i] -= quantum;
                } else {
                    currentTime += burstRemaining[i];
                    burstRemaining[i] = 0;
                }
                const endTime = currentTime;
                quantumExecutionArray.push({
                    process: `P${currentProcess}`,
                    arrivalTime:processes[i].arrivalTime,
                    burstTime:processes[i].burstTime,
                    startTime,
                    endTime,
                    timeQuantum:quantum,
                    percentageCompleted:Math.round((((processes[i].burstTime-burstRemaining[i])/processes[i].burstTime)*100)*100)/100
                });

                if (burstRemaining[i] > 0) {
                    done = false;
                } else {
                    waitingTime[i] = startTime - processes[i].arrivalTime;
                    completionTime[i] = endTime;
                    turnaroundTime[i] = completionTime[i] - processes[i].arrivalTime;
                }
            }
        }

        if (done) break;
    }
console.log(quantumExecutionArray);
    processes.forEach(process => {
        const outputProcess = { ...process };
        outputProcesses.push(outputProcess);
    });

    for (let i = 0; i < n; i++) {
        outputProcesses[i]['waitingTime'] = waitingTime[i];
        outputProcesses[i]['completionTime'] = completionTime[i];
        outputProcesses[i]['turnAroundTime'] = turnaroundTime[i];
    }

    // Calculate total waiting time and turnaround time
    const totalWaitingTime = waitingTime.reduce((acc, val) => acc + val, 0);
    const averageWaitingTime = totalWaitingTime / n;
    const totalTurnaroundTime = turnaroundTime.reduce((acc, val) => acc + val, 0);
    const averageTurnaroundTime = totalTurnaroundTime / n;

    // Output results
    return [outputProcesses, Math.round(averageWaitingTime), Math.round(averageTurnaroundTime), quantumExecutionArray];
}
export default calculateOutputForRR;

