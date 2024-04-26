function calculateOutputForPriority(inputProcesses) {
  // Sort processes based on arrival time
  const processes = inputProcesses.map((p) => ({ ...p }));
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  console.log(processes);

  const n = processes.length;
  const burstRemaining = processes.map((p) => p.burstTime);
  const waitingTime = new Array(n).fill(0);
  const completionTime = new Array(n).fill(0);
  const turnaroundTime = new Array(n).fill(0);
  let outputProcesses = [];
  let lastExecutionTimes = [];
  let currentTime = processes[0].arrivalTime;

  const priorityExecutionArray = [];
  debugger;
  while (true) {
    let done = true;
    let highestPriority = Infinity;
    let nextProcessIndex = -1;

    for (let i = 0; i < n; i++) {
      if (
        burstRemaining[i] > 0 &&
        processes[i].arrivalTime <= currentTime &&
        processes[i].priority < highestPriority
      ) {
        
        highestPriority = processes[i].priority;
        nextProcessIndex = i;
        done = false;
      }
    }

    if (done) break;

    let currentProcessId = processes[nextProcessIndex].id;
    let startTime = currentTime;

    while (burstRemaining[nextProcessIndex] > 0) {
      currentTime++;
      burstRemaining[nextProcessIndex]--;

      let higherPriorityIndex = -1;
      for (let i = 0; i < n; i++) {
        if (
          i !== nextProcessIndex &&
          burstRemaining[i] > 0 &&
          processes[i].arrivalTime <= currentTime &&
          processes[i].priority < processes[nextProcessIndex].priority
        ) {
          
          higherPriorityIndex = i;
          break;
        }
      }
      const endTime = currentTime;
      const timeRan = endTime - startTime;
      if (higherPriorityIndex !== -1) {
        const completedDuration=processes[nextProcessIndex].burstTime - burstRemaining[nextProcessIndex];
        priorityExecutionArray.push({
          name: `P${currentProcessId}`,
          arrivalTime: processes[nextProcessIndex].arrivalTime,
          burstTime: processes[nextProcessIndex].burstTime,
          lastExecutionTime: nextProcessIndex < lastExecutionTimes.length ? lastExecutionTimes[nextProcessIndex] : processes[nextProcessIndex].arrivalTime,
          startTime,
          endTime,
          timeRan,
          completedDuration,
          endPercentage: Math.round(((processes[nextProcessIndex].burstTime - burstRemaining[nextProcessIndex]) / processes[nextProcessIndex].burstTime)*100*100)/100,
          percentageBeforeStart: Math.round(((completedDuration-timeRan )/ processes[nextProcessIndex].burstTime) * 100 * 100) / 100,
          priority: processes[nextProcessIndex].priority,
          remainingBurst: burstRemaining[nextProcessIndex],
        });

        startTime = currentTime;
        nextProcessIndex = higherPriorityIndex;
        currentProcessId = processes[nextProcessIndex].id;
      }
    }
    const endTime = currentTime;
    const timeRan = endTime - startTime;
    const completedDuration=processes[nextProcessIndex].burstTime - burstRemaining[nextProcessIndex];
    priorityExecutionArray.push({
      name: `P${currentProcessId}`,
      arrivalTime: processes[nextProcessIndex].arrivalTime,
      burstTime: processes[nextProcessIndex].burstTime,
      lastExecutionTime: nextProcessIndex < lastExecutionTimes.length ? lastExecutionTimes[nextProcessIndex] : processes[nextProcessIndex].arrivalTime,
      startTime,
      endTime,
      timeRan,
      completedDuration,
      endPercentage: Math.round(((processes[nextProcessIndex].burstTime - burstRemaining[nextProcessIndex]) / processes[nextProcessIndex].burstTime)*100*100)/100,
      percentageBeforeStart: Math.round(((completedDuration-timeRan)/ processes[nextProcessIndex].burstTime) * 100 * 100) / 100,
      priority: processes[nextProcessIndex].priority,
      remainingBurst: burstRemaining[nextProcessIndex],
    });

    completionTime[nextProcessIndex] = endTime;
    turnaroundTime[nextProcessIndex] =
      completionTime[nextProcessIndex] -
      processes[nextProcessIndex].arrivalTime;
  }
  for (let i = 0; i < n; i++) {
    waitingTime[i] = turnaroundTime[i] - processes[i].burstTime;
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

  console.log(priorityExecutionArray);

  const totalWaitingTime = waitingTime.reduce((acc, val) => acc + val, 0);
  const averageWaitingTime = totalWaitingTime / n;
  const totalTurnaroundTime = turnaroundTime.reduce((acc, val) => acc + val, 0);
  const averageTurnaroundTime = totalTurnaroundTime / n;

  return [
    outputProcesses,
    Math.round(averageWaitingTime),
    Math.round(averageTurnaroundTime),
    priorityExecutionArray,
  ];
}

export default calculateOutputForPriority;
