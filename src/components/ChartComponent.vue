<template>
  <div class="parent">
    <div>
      <h1>Completed</h1>
    </div>

    <div v-if="isProcessStarted" class="processes">

      <div v-for="(process, index) in completed" :key="index" class="process"
        :style="{ width: process.width + 'px', backgroundColor: process.color }">
        <div class="label">{{ process.name }} : {{ process.burstTime }}</div>
      </div>

    </div>
    <div>
      <h1>Running</h1>
    </div>

    <div v-if="isProcessStarted" class="running-processes">
      <div  v-for="(process, index) in running" :key="index" class="process" 
        :style="{ width: process.width + 'px', backgroundColor: process.color }">
        <div class="label">{{ process.name }} : {{ process.burstTime }}</div>
      </div>

    </div>
    <div>
      <h1>Waiting</h1>
    </div>
    <div v-if="isProcessStarted" class="processes">

      <div v-for="(process, index) in pending" :key="index" class="process"
        :style="{ width: process.width + 'px', backgroundColor: process.color }">
        <div class="label">{{ process.name }}</div>
      </div>

    </div>

  </div>
</template>

<script>
import calculateOutputForFCFS from "@/helpers/fcfs";

export default {
  props: {
    inputProcesses: Array,
    isProcessStarted: Boolean
  },
  data() {
    return {
      pending: [],
      running: [],
      completed: []
    };
  },
  watch: {
    isProcessStarted: function (newVal) {
      if (newVal) {
        this.runFCFS();
      }
    }
  },
  // computed: {
  //   ...mapState(useProcessStore, ["pending", "running", "completed"])
  // },
  methods: {
    generateRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    runFCFS() {
      const outputProcesses = calculateOutputForFCFS(this.inputProcesses);
      this.pending = [...outputProcesses];
      
      outputProcesses.forEach((process, index) => {
        process.width = process.burstTime*20;
        process.color = this.generateRandomColor();
      });

      let currentTime = 0;
      outputProcesses.forEach((process) => {
        const arrivalDelay = process.arrivalTime - 1;
        setTimeout(() => {
          this.pending = this.pending.filter(p => p.name != process.name);
          debugger;
          this.running = [process];
          console.log(this.running)
          process.width = process.burstTime * 40;
          this.completed.push(process);
          currentTime = Math.max(currentTime, arrivalDelay) + process.burstTime;
        }, process.arrivalTime * 1000);

      });
    },
  },
};
</script>

<style scoped>
.parent {
  display: flex;
  flex-direction: column;
  border: 3px solid #42b883;
  position: fixed;
  width: 700px;
  text-align: center;
  border-radius: 20px;
}

.running-process {
  width: 100%;
  height: 150px;
  border: 3px solid #42b883;
}

.processes {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 150px;
  border: 3px solid #42b883;

  margin: 5px;
  border-radius: 20px;

}

.process {
  height: 30px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin: 5px
    /* transition: 1s linear;  */
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
