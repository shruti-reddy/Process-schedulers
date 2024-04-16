function calculateOutputForRR(processes, quantum) {
    // Sort processes based on arrival time
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const n = processes.length;
    // const burstRemaining = new Array(n);
    const burstRemaining = processes.map(p => p.burstTime);
    const waitingTime = new Array(n).fill(0);
    const completionTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    let outputProcesses = [];

    let currentTime = processes[0].arrivalTime;
    const queue = [];

    while (true) {
        let done = true;

        for (let i = 0; i < n; i++) {
            if (burstRemaining[i] > 0 && processes[i].arrivalTime <= currentTime) {
                done = false;

                if (burstRemaining[i] > quantum) {
                    currentTime += quantum;
                    burstRemaining[i] -= quantum;
                } else {
                    currentTime += burstRemaining[i];
                    waitingTime[i] = currentTime - processes[i].burstTime - processes[i].arrivalTime;
                    burstRemaining[i] = 0;
                    completionTime[i] = currentTime;
                    turnaroundTime[i] = completionTime[i] - processes[i].arrivalTime;
                }
            }
        }

        if (done) break;
    }

    processes.forEach(process => {
        const outputProcess = { ...process };
        outputProcesses.push(outputProcess);
    })

   
    for (let i = 0; i < n; i++) {
        outputProcesses[i]['waitingTime'] = waitingTime[i];
        outputProcesses[i]['completionTime'] = completionTime[i]
        outputProcesses[i]['turnAroundTime'] = turnaroundTime[i]
    }

     // Calculate total waiting time and turnaround time
     let totalWaitingTime = waitingTime.reduce((acc, val) => acc + val, 0);
     let averageWaitingTime = totalWaitingTime/n;
     let totalTurnaroundTime = turnaroundTime.reduce((acc, val) => acc + val, 0);
     let averageTurnaroundTime = totalTurnaroundTime/n;
     
     // Output results
     return [outputProcesses, Math.round(averageWaitingTime), Math.round(averageTurnaroundTime)];
    }
    
    export default calculateOutputForRR;


