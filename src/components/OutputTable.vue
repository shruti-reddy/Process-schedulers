<script>
import calculateOutputForFCFS from "@/helpers/fcfs";
import calculateOutputForSJF from "@/helpers/sjf";
import calculateOutputForRR from "@/helpers/RoundRobin";
import calculateOutputForPriorityScheduling from "@/helpers/PriorityScheduling";
export default {
  name: "output-table",
  props: {
    selectedAlgorithm: String,
    processes: Array,
    quantum: Number,
    isProcessRunning: Boolean,
  },
  emits: ["processStarted"],
  data() {
    return {
      outputProcesses: [],
      averageWaitingTime: 0,
      averageTurnAroundTime: 0,
    };
  },
  watch: {
    isProcessRunning: function (newVal) {
      if (newVal) {
        this.calculateOutputs();
      }
    },
    selectedAlgorithm: function() {
      this.outputProcesses = [];
    }
  },
  methods: {
    calculateOutputs() {
      switch (this.selectedAlgorithm) {
        case "FCFS":
          [this.outputProcesses, this.averageWaitingTime, this.averageTurnAroundTime] = calculateOutputForFCFS(this.processes);
          break;
        case "SJF":
          [this.outputProcesses, this.averageWaitingTime, this.averageTurnAroundTime] = calculateOutputForSJF(this.processes);
          break;
        case "Priority Scheduling":
          [this.outputProcesses, this.averageWaitingTime, this.averageTurnAroundTime] = calculateOutputForPriorityScheduling(
            this.processes
          );
          break;
        case "Round Robin":
          [this.outputProcesses, this.averageWaitingTime, this.averageTurnAroundTime] = calculateOutputForRR(this.processes, this.quantum);
          break;
      }
    },
  },
};
</script>

<template>
  <div v-if="outputProcesses.length>0">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Arrival Time</th>
          <th>Burst Time</th>
          <th>Waiting Time</th>
          <th>Turn Around Time</th>
          <th>Completion Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="process in outputProcesses" :key="process.name">
          <td>{{ process.name }}</td>
          <td>{{ process.arrivalTime }}</td>
          <td>{{ process.burstTime }}</td>
          <td>{{ process.waitingTime }}</td>
          <td>{{ process.turnAroundTime }}</td>
          <td>{{ process.completionTime }}</td>
        </tr>
      </tbody>
    </table>
    <div class="result">
      <p>Average Waiting Time: {{ averageWaitingTime }} seconds</p>
      <p>Average Turn around Time: {{ averageTurnAroundTime }} seconds</p>
    </div>
  </div>
</template>

<style scoped>
.processes {
  display: flex;
  flex-direction: row;
}

button {
  width: 40%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #42b883;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

.result {
  width: 100%;
  display: flex;
  flex-direction: row;

  p {
    width: 50%;
  }
}
</style>
