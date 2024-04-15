<template>
  <div class="parent">
    <div class="child">
      <h1>Completed</h1>
    

      <div v-if="isProcessStarted" class="processes">
        <div
          v-for="(process, index) in completed"
          :key="index"
          class="process"
          :style="{ backgroundColor: process.color }"
        >
          <div class="label">{{ process.name }} : {{ process.burstTime }}</div>
        </div>
      </div>
    </div>
    <div class="child">
      <h1>Running</h1>

      <div v-if="isProcessStarted" class="processes">
        <div
          v-for="(process, index) in running"
          :key="index"
          class="process"
          :style="{ backgroundColor: process.color }"
        >
          <div class="label">{{ process.name }} : {{ process.burstTime }}</div>
        </div>
      </div>
    </div>
    <div class="child">
      <h1>Waiting</h1>
      <div v-if="isProcessStarted" class="processes">
        <div
          v-for="(process, index) in pending"
          :key="index"
          class="process"
          :style="{ backgroundColor: process.color }"
        >
          <div class="label">{{ process.name }}: {{ process.burstTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import calculateOutputForFCFS from "@/helpers/fcfs";
import shortestJobFirst from "@/helpers/sjf";
import calculateOutputForRR from "@/helpers/RoundRobin"

export default {
  props: {
    inputProcesses: Array,
    isProcessStarted: Boolean,
    selectedAlgorithm: String,
  },
  data() {
    return {
      pending: [],
      running: [],
      completed: [],
    };
  },
  watch: {
    isProcessStarted: function (newVal) {
      if (newVal) {
        this.resetCurrents();
        this.runFCFS();
      }
    },
  },
  methods: {
    generateRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    resetCurrents() {
      this.pending=[];
      this.running=[];
      this.completed=[];
    },
    runFCFS() {
      let outputProcesses = [];
      if (this.selectedAlgorithm === "FCFS") {
        outputProcesses = calculateOutputForFCFS(this.inputProcesses);
      } else if (this.selectedAlgorithm === "SJF") {
        outputProcesses = shortestJobFirst(this.inputProcesses);
      }
      else if(this.selectedAlgorithm==="Round Robin"){
        outputProcesses = calculateOutputForRR(this.inputProcesses,this.quantum);        

      }
      this.pending = [...outputProcesses];

      outputProcesses.forEach((process, index) => {
        process.width = process.burstTime * 10;
        process.color = this.generateRandomColor();
      });

      let currentTime = 0;
      outputProcesses.forEach((process, index) => {
        const arrivalDelay = process.arrivalTime;
        setTimeout(() => {
          this.running = [process];
          this.pending = this.pending.filter((p) => p.name != process.name);
        }, (process.waitingTime) * 1000)
        setTimeout(() => {
          process.width = process.burstTime * 10;
          this.completed.push(process);
          currentTime = Math.max(currentTime, arrivalDelay) + process.burstTime;
          if(this.completed.length === outputProcesses.length){
            this.running = [];
          }
        }, (process.waitingTime + process.burstTime) * 1000);
      });
    },
  },
};
</script>

<style scoped>
.parent {
  display: flex;
  flex-direction: row;
  border: 2px solid #42b883;
  text-align: center;
  border-radius: 12px;
  max-width: 95%;
}

.running-process {
  width: 100%;
  height: 150px;
  border: 2px solid #42b883;
  align-items: center;
}

.processes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  min-height: 150px;
  border: 2px solid #42b883;
  margin: 5px;
  border-radius: 12px;
}

.process {
  height: 30px;
  margin-right: 5px;
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin: 5px;
  background-color: white;
  /* transition: 1s linear;  */
}

.child {
  flex-grow: 1;
}

.label {
  color: white;
}

button {
  margin-top: 10px;
}

input {
  margin-bottom: 5px;
}
</style>
