<script>
import OutputTable from "../components/OutputTable.vue";
import NonPreemptive from '../components/NonPreemptive.vue';
import Preemptive from "./Preemptive.vue";
export default {
    name: 'algorithm-chooser',
    components: {
        OutputTable,
        Preemptive,
        NonPreemptive
    },
    data() {
        return {
            algorithms: [
                {
                    title: "FCFS",
                    description: "The first come first serve algorithm schedules the processes in the order of their arrival in the ready queue.",
                },
                {
                    title: "SJF",
                    description: "The shortest job first algorithm schedules the processes in the order of their burst time.",
                },
                {
                    title: "Round Robin",
                    description: "The round robin algorithm schedules the processes in cyclic manner with each process getting small unit of CPU time.",
                },
                {
                    title: 'Priority Scheduling',
                    description: "The priority scheduling algorithm schedules the processes according to the priority assigned to each process.",
                }
            ],
            selectedAlgorithm: '',
            processes: [],
            numberOfProcesses: '',
            isProcessRunning: false,
            isStartDisabled: false,
            quantum: 0,
        }
    },
    watch: {
        numberOfProcesses: function () {
            this.processes = [];
            for (let i = 0; i < this.numberOfProcesses; i++) {
                this.processes.push({
                    id: i+1,
                    name: `P${i + 1}`,
                    arrivalTime: "",
                    burstTime: "",
                    priority: ""
                })
            }
        }
    },
    computed: {
        isPreemptive() {
            if(this.selectedAlgorithm == 'FCFS' || this.selectedAlgorithm == 'SJF') {
                return false;
            }
            return true;
        }
    },
    methods: {
        selectedAlgorithmChanged(algo) {
            this.selectedAlgorithm = algo.title;
            this.isStartDisabled = false;
            this.isProcessRunning = false;
        },
        startClicked() {
            this.isProcessRunning = true;
            this.isStartDisabled = true;
        },
        handleProcessCompleted() {
            this.isProcessRunning = false;
            this.isStartDisabled = false;
        }
    }
}
</script>

<template>
    <h2><b>Select CPU shceduling algorithm</b></h2>
    <div class="app">
        <div class="container">
            <div class="algorithm-chooser">
                <div class="card" v-for="algo in algorithms" :key="algo.title">
                    <button class="title" :class="{ 'active': selectedAlgorithm === algo.title }"
                        v-on:click="selectedAlgorithmChanged(algo)">{{ algo.title }}</button>
                    <p class="description">{{ algo.description }}</p>
                </div>
            </div>
            <div class="wrapper" v-if="selectedAlgorithm">
                <div class="flex-row">
                    <label>Enter number of processes to run</label>
                    <input name="totalProcess" class="abc" v-model="numberOfProcesses"></input>
                    <label v-if="selectedAlgorithm === 'Round Robin'">Quantum</label>
                    <input v-if="selectedAlgorithm === 'Round Robin'"placeholder="Enter time Quantum" 
                        v-model="quantum" type="number"></input>

                </div>
                <div v-for="process in processes" :key="process.name" class="flex-column">
                    <div class="processes">
                        <input placeholder="Enter process name" v-model="process.name"></input>
                        <input placeholder="Enter Arrival time" v-model="process.arrivalTime" type="number"></input>
                        <input placeholder="Enter Burst time" v-model="process.burstTime" type="number"></input>
                        <input v-if="selectedAlgorithm === 'Priority Scheduling'" placeholder="Enter priority"
                            v-model="process.priority" type="number"></input>
                    </div>
                </div>
                <button :disabled="isStartDisabled" v-on:click="startClicked">Start {{ selectedAlgorithm }} algorithm</button>
            </div>
        </div>
        <div class="chart">
            <Preemptive v-if="isPreemptive"
                :selectedAlgorithm="selectedAlgorithm" 
                :inputProcesses="processes"
                :isProcessRunning="isProcessRunning"
                :quantum=Number(quantum)
                v-on:process-running-completed="handleProcessCompleted" />
            <NonPreemptive v-if="!isPreemptive"
                :selectedAlgorithm="selectedAlgorithm" 
                :inputProcesses="processes"
                :isProcessRunning="isProcessRunning"
                v-on:process-running-completed="handleProcessCompleted"/>
            <OutputTable :selectedAlgorithm="selectedAlgorithm" 
                :quantum=Number(quantum) 
                :processes="processes"
                :isProcessRunning="isProcessRunning" />
        </div>
    </div>
</template>

<style>
.app {
    display: flex;
    flex-direction: row;
}

.container {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: 10px;
    border: 2px solid #42b883;
    border-radius: 12px;
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
    flex-direction: row;
    margin-bottom: 30px;
}

.chart {
    margin: 0 10px;
    flex: 1;
    border: 2px solid white;
    border-radius: 10px;
}

.title:hover+.description {
    display: block;
    color: rgb(43, 43, 99);
    margin: 0;
}

button:active {
    background-color: blue;
}

button:disabled {
    background-color: lightgray;
}

.description {
    display: none;
    position: absolute;
    left: 0;
    font-size: 14px;
    color: pink;
}

.wrapper {
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
    /* width: 150px; */
    height: 40px;
}

input {
    font-size: 14px;
    max-width: 150px;
    margin: 10px;
    padding: 10px;
    border: 1px solid #42b883;
    border-radius: 22px;
}

label {
    margin: auto 0;
}

.abc {
    width: 12%;
}
</style>