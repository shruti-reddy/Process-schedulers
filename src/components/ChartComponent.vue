<template>
  <div class="parent">
    <div><h1>Running</h1></div>
    
    <div v-if="isProcessStarted" class="processes">
      
      <div
        v-for="(process, index) in outputProcesses"
        :key="index"
        class="process"
        :style="{ width: process.width + 'px', backgroundColor: process.color }"
      >
        <div class="label">{{ process.name }} : {{process.burstTime}}</div>
      </div>
      
    </div>
    <div><h1>Waiting</h1></div>
    <div v-if="isProcessStarted" class="processes">
      
      <div
        v-for="(process, index) in outputProcesses"
        :key="index"
        class="process"
        :style="{ width: process.width + 'px', backgroundColor: process.color }"
      >
        <div class="label">{{ process.name }}</div>
      </div>
      
    </div>
   
  </div>
</template>

<script>
import calculateOutputForFCFS from "@/helpers/fcfs";
export default {
  props: { 
    processes: Array,
    isProcessStarted: Boolean
   },
  data() {
    return {
      outputProcesses: [],
    };
  },
  watch: {
    isProcessStarted: function(newVal) {
      if(newVal) {
        this.runFCFS();
      }
    }
  },
  methods: {
    generateRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    runFCFS() {
      console.log("calling FCFS");
      
      this.outputProcesses = calculateOutputForFCFS(this.processes);
      console.log(this.outputProcesses)

      this.outputProcesses.forEach((process, index) => {
        process.width = index + 1;
        process.color = this.generateRandomColor();
      });

      console.log(this.outputProcesses);
      let currentTime = 0;
      this.outputProcesses.forEach((process) => {
        const arrivalDelay =process.arrivalTime - 1; 
        setTimeout(() => {
          process.width = process.burstTime * 40;
        }, arrivalDelay * 1000);
        currentTime = Math.max(currentTime, arrivalDelay) + process.burstTime;
      });
    },
    //   runFCFS() {
    //     const outputProcesses=calculateOutputForFCFS(this.processes);
    //     console.log(outputProcesses);
    //   },
  },
};
</script>

<style scoped>
.parent{
  display:flex;
  flex-direction:column;
  border:3px solid #42b883;
  position:fixed;
  width:700px;
  text-align:center;
  border-radius:20px ;
}
.processes {
  display: flex;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  height: 200px;
  border:3px solid #42b883;
   
  margin:5px;
  border-radius:20px ;
 
}

.process {
  height: 30px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin:5px
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
