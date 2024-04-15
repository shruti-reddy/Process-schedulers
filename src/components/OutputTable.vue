<script>
import calculateOutputForFCFS from "@/helpers/fcfs";
import calculateOutputForSJF from "@/helpers/sjf";
import calculateOutputForRR from "@/helpers/RoundRobin";
export default {
  name: "output-table",
  props: {
    algorithm: String,
    processes: Array,
    quantum: Number,
  },
  emits: ["processStarted"],
  data() {
    return {
      outputProcesses: [],
      isProcessStarted: false,
    };
  },
  methods: {
    calculateOutputs() {
      switch (this.algorithm) {
        case "FCFS":
          this.outputProcesses = calculateOutputForFCFS(this.processes);
          break;
        case "SJF":
          this.outputProcesses = calculateOutputForSJF(this.processes);
          break;
        case "Priority Scheduling":
          this.outputProcesses = calculateOutputForPriorityScheduling(
            this.processes
          );
          break;
        case "Round Robin":
          this.outputProcesses = calculateOutputForRR(this.processes, this.quantum);
          debugger;
          break;
      }
    },
    startClicked() {
      this.isProcessStarted = true;
      this.calculateOutputs();
      this.$emit("processStarted", true);
    },
  },
};
</script>

<template>
  <!-- <button v-on:click="startClicked">Start {{ algorithm }} algorithm</button>
    
    <div v-for="process in outputProcesses" :key="process.name" class="processes">
        <p>Name: {{ process.name }}</p>
        <p> Arrival Time: {{ process.arrivalTime }} </p>
        <p> Burst Time: {{ process.burstTime }} </p>
        <p> Waiting Time: {{ process.waitingTime }}</p>
        <p> Turn Around Time: {{ process.turnAroundTime }} </p>
        <p> Completion Time: {{ process.completionTime }} </p>
    </div> -->
  <button v-on:click="startClicked">Start {{ algorithm }} algorithm</button>
  <table v-if="isProcessStarted">
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
</style>
