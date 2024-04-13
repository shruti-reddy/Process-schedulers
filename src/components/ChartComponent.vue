<template>
    <div>
      <div class="processes">
        <div v-for="(process, index) in this.processes" :key="index" class="process" :style="{ width: process.width + 'px', backgroundColor: process.color, }">
          <div class="label">{{ process.name }}</div>
        </div>
        
      </div>
      <div>
        <button ></button>
      </div>
      
    </div>

  </template>
  
  <script>
  import calculateOutputForFCFS from '@/helpers/fcfs';
  export default {
    props:{processes:Array},
    data() {
      return {
        outputProcesses: [],
      };
    },
    methods: {
      generateRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
      },
    runFCFS()
      {
        const outputProcesses=calculateOutputForFCFS(this.processes);
    //     console.log(outputProcesses);

      }
    //   runFCFS() {
    //     const outputProcesses=calculateOutputForFCFS(this.processes);
    //     console.log(outputProcesses);
    //   },
    }
  }
  </script>
  
  <style scoped>
  .processes {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
    height:200px;
  }
  
  .process {
    height: 30px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
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