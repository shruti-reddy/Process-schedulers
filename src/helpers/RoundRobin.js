function calculateOutputForRR(inputProcesses, quantum) {
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
  let lastExecutionTimes = [];
  const quantumExecutionArray = [];
  // Store the execution order with start and end times

  while (true) {
    let done = true;

    for (let i = 0; i < n; i++) {
      if (burstRemaining[i] > 0 && processes[i].arrivalTime <= currentTime) {
        done = false;
        const completedBeforeExecution = processes[i].burstTime - burstRemaining[i];
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
        const timeRan = endTime - startTime;

        quantumExecutionArray.push({
          name: `P${currentProcess}`,
          burstTime: processes[i].burstTime,
          lastExecutionTime: i < lastExecutionTimes.length ? lastExecutionTimes[i] : processes[i].arrivalTime,
          startTime,
          endTime,
          timeRan,
          completedBeforeExecution,
          endPercentage: Math.round(((processes[i].burstTime - burstRemaining[i]) / processes[i].burstTime)*100*100)/100,
          percentageBeforeStart: Math.round((completedBeforeExecution / processes[i].burstTime) * 100 * 100) / 100
        });
        lastExecutionTimes[i] = endTime;

        if (burstRemaining[i] > 0) {
          done = false;
        } else if (n === 1) {
          waitingTime[i] = 0;
          completionTime[i] = endTime;
          turnaroundTime[i] = completionTime[i] - processes[i].arrivalTime;
        } else {
          waitingTime[i] = startTime - processes[i].arrivalTime;
          completionTime[i] = endTime;
          turnaroundTime[i] = completionTime[i] - processes[i].arrivalTime;
        }
      }
    }

    if (done) break;
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
    quantumExecutionArray,
  ];
}
export default calculateOutputForRR;
