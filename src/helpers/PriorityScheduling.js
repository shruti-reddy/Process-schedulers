function calculateOutputForPriority(inputProcesses) {
    // Sort processes based on arrival time
    const processes = inputProcesses.map((p) => ({ ...p }));
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
    const n = processes.length;
    const burstRemaining = processes.map((p) => p.burstTime);
    const waitingTime = new Array(n).fill(0);
    const completionTime = new Array(n).fill(0);
    const turnaroundTime = new Array(n).fill(0);
    let outputProcesses = [];
  
    let currentTime = processes[0].arrivalTime;
  
    // Store the execution order with start and end times
    const priorityExecutionArray = [];
  
    while (true) {
      let done = true;
      let highestPriority = Infinity;
      let nextProcessIndex = -1;

      for (let i = 0; i < n; i++) {
        if (burstRemaining[i] > 0 && processes[i].arrivalTime <= currentTime && processes[i].priority < highestPriority) {
          highestPriority = processes[i].priority;
          nextProcessIndex = i;
          done = false;
        }
      }
  
      if (done) break;
  
      const currentProcess = processes[nextProcessIndex].id;
      const startTime = currentTime;
  
      // Update waiting time for processes that are waiting
      for (let i = 0; i < n; i++) {
        if (i !== nextProcessIndex && burstRemaining[i] > 0 && processes[i].arrivalTime <= currentTime) {
          waitingTime[i]++;
        }
      }
  
      currentTime++;
      burstRemaining[nextProcessIndex]--;
  
      const endTime = currentTime;
  
      priorityExecutionArray.push({
        name: `P${currentProcess}`,
        arrivalTime: processes[nextProcessIndex].arrivalTime,
        burstTime: processes[nextProcessIndex].burstTime,
        startTime,
        endTime,
        priority: processes[nextProcessIndex].priority,
        remainingBurst: burstRemaining[nextProcessIndex],
      });
  
      if (burstRemaining[nextProcessIndex] === 0) {
        completionTime[nextProcessIndex] = endTime;
        turnaroundTime[nextProcessIndex] = completionTime[nextProcessIndex] - processes[nextProcessIndex].arrivalTime;
      }
    }
  
    processes.forEach((process) => {
      const outputProcess = { ...process };
      outputProcesses.push(outputProcess);
    });
  
    for (let i = 0; i < n; i++) {
      outputProcesses[i]["waitingTime"] = waitingTime[i];
      outputProcesses[i]["completionTime"] = completionTime[i];
      outputProcesses[i]["turnAroundTime"] = turnaroundTime[i];
    }
  
    // Calculate total waiting time and turnaround time
    const totalWaitingTime = waitingTime.reduce((acc, val) => acc + val, 0);
    const averageWaitingTime = totalWaitingTime / n;
    const totalTurnaroundTime = turnaroundTime.reduce((acc, val) => acc + val, 0);
    const averageTurnaroundTime = totalTurnaroundTime / n;
  
    // Output results
    return [
      outputProcesses,
      Math.round(averageWaitingTime),
      Math.round(averageTurnaroundTime),
      priorityExecutionArray,
    ];
  }
  
  export default calculateOutputForPriority;
  