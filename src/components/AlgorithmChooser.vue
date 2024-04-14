<script>
import OutputTable from "../components/OutputTable.vue";
import ChartComponent from '../components/ChartComponent.vue';
export default {
    name: 'algorithm-chooser',
    components: {
        OutputTable,
        ChartComponent
    },
    data() {
        return {
            algorithms: [
                {
                    title: "FCFS",
                    description: "The first come first serve algorithm is a scheduling algorithm that schedules the processes in the order of their arrival in the ready queue.",
                },
                {
                    title: "SJF",
                    description: "The shortest job first algorithm is a scheduling algorithm that schedules the processes in the order of their burst time.",
                },
                {
                    title: "Round Robin",
                    description: "The round robin algorithm is a scheduling algorithm that schedules the processes in the order of their arrival in the ready queue.",
                },
                {
                    title: 'Priority Scheduling'
                }
            ],
            selectedAlgorithm: '',
            processes: [],
            numberOfProcesses: '',
            isProcessStarted: false,
        }
    },
    watch: {
        numberOfProcesses: function () {
            // this.processes = [];
            // for (let i = 0; i < this.numberOfProcesses; i++) {
            //     this.processes.push({
            //         name: `P${i + 1}`,
            //         arrivalTime: "",
            //         burstTime: "",
            //         priority: ""
            //     })
            // }
            this.processes = [
                {name: 'p1', arrivalTime: 2, burstTime: 15},
                {name: 'p2', arrivalTime: 1, burstTime: 15},
                {name: 'p3', arrivalTime: 6, burstTime: 14},
                {name: 'p4', arrivalTime: 0, burstTime: 10},
                {name: 'p5', arrivalTime: 3, burstTime: 18}
            ]
        }
    },
    methods: {
        selectedAlgorithmChanged(algo) {
            this.selectedAlgorithm = algo.title;
            this.isProcessStarted = false;
        },
        processStarted(value) {
            this.isProcessStarted = value;
        }
    }
}
</script>

<template>
    <h1><b>Select CPU shceduling algorithm</b></h1>
    <div class="app">
    <div class="container">
        <div class="algorithm-chooser">
          <div class="card" v-for="algo in algorithms" :key="algo.title">
            <button class="title" :class="{ 'active': selectedAlgorithm === algo.title }" v-on:click="selectedAlgorithmChanged(algo)">{{ algo.title }}</button>
            <p class="description">{{ algo.description }}</p>
          </div>
        </div>
        <div class="wrapper" v-if="selectedAlgorithm">
        <div class="flex-row">
            <label>Enter number of processes to run</label>
            <input name="totalProcess" class="abc"
                v-model="numberOfProcesses"></input>
        </div>
        <div v-for="process in processes" :key="process.name" class="flex-column">
            <div class="processes">
                <input placeholder="Enter process name" v-model="process.name"></input>
                <input placeholder="Enter Arrival time" v-model="process.arrivalTime" type="number"></input>
                <input placeholder="Enter Burst time" v-model="process.burstTime" type="number"></input>
            </div>
        </div>
        <OutputTable :algorithm="selectedAlgorithm" :processes="processes" @process-started="processStarted"/> 
        </div>
    </div>
        <div class="chart">
            <ChartComponent :inputProcesses="processes" :isProcessStarted="isProcessStarted" />
        </div>
    </div>

</template>

<style>

.app {
    display: flex;
}

.container {
    display: flex;
    flex: row;
    flex-direction: column;
    position: relative;
}

.title {
    background-color: #42b883;
    color: white;
    border-radius: 5px;
    border: 1px solid grey;
    font-size: larger;
    margin: 10px;
    width: 150px;
    height: 50px;
}

.title:hover {
  background-color: #1a0dab; 
}

.active {
    background-color: #1a0dab;
}



.algorithm-chooser {
    display: flex;
    flex: 1;
    flex-direction: row;
}

.chart {
    flex: 1;
    border: 2px solid white;
    border-radius: 10px;
    position: fixed;
    width: 600px;
    margin-left: 700px;
    height: 300px;
}

.title:hover+.description {
    display: block;
    color: rgb(43, 43, 99);
    margin:0;
}

button:active {
    background-color: blue;
}

.description {
    display: none;
    position: absolute;
    left: 0; 
    top: 20;
    
}

.wrapper {
  
    margin: 35px 0;
    display: flex;
    flex-direction: column;
}

.flex-row {
    display: flex;
    flex-direction: row;
    text-align: center;
}

.flex-column {
    display: flex;
    flex-direction: row;
}

.processes {
    display: flex;
    flex-direction: row;
}

button {
    background-color: #42b883;
    color: white;
    border-radius: 5px;
    border: 1px solid grey;
    font-size: larger;
    margin: 10px;
    width: 150px;
    height: 40px;
}

input {
    font-size: 14px;
    margin: 10px;
    padding: 14px;
    border: 1px solid #42b883;
    border-radius: 22px;
    width: 17%;
}

label {
    margin: auto 0;
}

.abc {
    width: 12%;
}

</style>