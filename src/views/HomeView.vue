<style>
.process-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
}

.process {
  width: 50px;
  height: 50px;
  background-color: blue;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-right: 10px;
}
</style>

<template>
  <div id="app">
    <AlgorithmChooser/>
  </div>
</template>

<script>
import AlgorithmChooser from "../components/AlgorithmChooser.vue";
export default {
  components: {AlgorithmChooser},
  data() {
    return {
      processes: [
        { name: 'P1', arrivalTime: 0, burstTime: 5 },
        { name: 'P2', arrivalTime: 2, burstTime: 3 },
        { name: 'P3', arrivalTime: 4, burstTime: 1 },
        { name: 'P4', arrivalTime: 5, burstTime: 2 }
      ],
      executedProcesses: [],
      showExecution: false
    }

  },
  methods: {
    runFCFS() {
      this.showExecution = true;
      let currentTime = 0;
      for (let process of this.processes) {
        currentTime = Math.max(currentTime, process.arrivalTime);
        this.executedProcesses.push({
          name: process.name,
          arrivalTime: currentTime,
          burstTime: process.burstTime,
          endTime: currentTime + process.burstTime
        });
        currentTime += process.burstTime;
      }
    }
  }
};
</script>
