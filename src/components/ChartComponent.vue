<template>
  <div v-if="isProcessStarted" class="parent">
    <div class="child">
      <h1>Completed</h1>
      <div class="processes">
        <div v-for="(process, index) in completed" :key="index" class="process"
          :style="{ backgroundColor: process.color }">
          <div class="label">{{ process.name }} : {{ process.burstTime }}</div>
        </div>
      </div>
    </div>
    <div class="child">
      <h1>Running</h1>
      <div class="processes">
        <div v-for="(process, index) in running" :key="index" id="running-process" class="runningProcess"
          :style="{ backgroundColor: process.color, width: '0%' }"> {{ process.name }}: 0%
          <!-- <div class="label">{{ process.name }} : {{ process.burstTime }}</div> -->
        </div>
      </div>
    </div>
    <div class="child">
      <h1>Waiting</h1>
      <div class="processes">
        <div v-for="(process, index) in pending" :key="index" class="process"
          :style="{ backgroundColor: process.color }">
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
    quantum: Number,
  },
  data() {
    return {
      outputProcesses: [],
      pending: [],
      running: [],
      completed: [],
      timeOuts: [],
    };
  },
  watch: {
    isProcessStarted: function (newVal) {
      if (newVal) {
        this.resetCurrents();
        if (this.selectedAlgorithm == 'FCFS' || this.selectedAlgorithm == 'SJF') {
          this.runNonPreemptive();
        }
        else {
          // this.runPreemptive()
        }
      }
    },
    selectedAlgorithm: function () {
      this.resetCurrents();
    }
  },
  methods: {
    generateRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    },
    resetCurrents() {
      this.pending = [];
      this.running = [];
      this.completed = [];
      this.timeOuts.forEach(timeout => {
        clearTimeout(timeout);
      });
    },
    runNonPreemptive() {
      if (this.selectedAlgorithm === "FCFS") {
        this.outputProcesses = calculateOutputForFCFS(this.inputProcesses)[0];
      } else if (this.selectedAlgorithm === "SJF") {
        this.outputProcesses = shortestJobFirst(this.inputProcesses)[0];
      }
      this.outputProcesses.forEach((process) => {
        process.width = process.burstTime * 10;
        process.color = this.generateRandomColor();
      });

      this.outputProcesses.forEach((process) => {
        this.simulatePending(process);
        this.simulateRunning(process);
        this.simulateCompleted(process);
      });
    },

    simulatePending(process) {
      const t = setTimeout(() => {
        this.pending.push(process);
      }, process.arrivalTime * 1000);
      this.timeOuts.push(t)
    },

    simulateRunning(process) {
      const t = setTimeout(() => {
        this.running = [process];
        this.pending = this.pending.filter((p) => p.name != process.name);
        this.$nextTick(() => {
          const runningProcess = document.getElementById("running-process");
          const id = setInterval(frame, 1000);
          const time = process.burstTime;
          let width = 0;
          function frame() {
            if (width >= time) {
              clearInterval(id);
            } else {
              width++;
              const widthPercentage = (100 * width) / time + '%';
              runningProcess.style.width = widthPercentage;
              runningProcess.innerHTML = process.name + ': ' + Math.round((100 * width) / time) + '%';
            }
          }
        })
      }, (process.arrivalTime + process.waitingTime) * 1000);
      this.timeOuts.push(t);
    },

    simulateCompleted(process) {
      const t = setTimeout(() => {
        process.width = process.burstTime * 10;
        this.running = [];
        this.completed.push(process);
        if (this.completed.length === this.outputProcesses.length) {
          this.running = [];
        }
      }, (process.arrivalTime + process.waitingTime + process.burstTime) * 1000);
      this.timeOuts.push(t);
    },

    runPreemptive() {
      this.inputProcesses.forEach(process => {
        this.simulatePending(process);
        setTimeout(() => { }, this.quantum * 1000)
      });
    }
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
}

.running-process {
  margin: 5px;
  width: 100%;
  height: 150px;
  border: 2px solid #42b883;
  align-items: center;
}

.runningProcess {
  color: white;
  margin: 5px;
  border-radius: 8px;
}

.processes {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
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
