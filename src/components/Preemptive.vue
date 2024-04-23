<template>
    <div class="parent">
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
            <div class="runningProcesses">
                <div v-for="(process, index) in running" :key="index">
                    <div class="runningLabel" :style="{ backgroundColor: process.color }"> Process - {{ process.name }}
                    </div>
                    <div class="runningLabel" :style="{ backgroundColor: process.color }"> Burst Time - {{
                        process.burstTime }}
                    </div>
                    <div class="runningProcess" id="running-process"
                        :style="{ backgroundColor: process.color, width: '0%' }">0%
                    </div>
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
import calculateOutputForRR from "@/helpers/RoundRobin"
export default {
    props: {
        inputProcesses: Array,
        selectedAlgorithm: String,
        isProcessRunning: Boolean
    },
    data() {
        return {
            outputProcesses: [],
            pending: [],
            running: [],
            completed: [],
            timeOuts: [],
        }
    },
    watch: {
        isProcessRunning: function (newVal) {
            if (newVal) {
                this.resetCurrents();
                // this.runPreemptive();
            }
        },
        selectedAlgorithm: function () {
            this.resetCurrents();
        }
    },
    methods: {
        runPreemptive() {
            this.outputProcesses = [
                {
                    name: 'P1',
                    arrivalTime: 0,
                    burstTime: 4,
                    waitingTime: 0,
                    timeRan: 2,
                    percentageCompleted: 50
                },
                {
                    name: 'P2',
                    arrivalTime: 0,
                    burstTime: 2,
                    waitingTime: 2,
                    timeRan: 2,
                    percentageCompleted: 100
                },
                {
                    name: 'P1',
                    arrivalTime: 0,
                    burstTime: 4,
                    waitingTime: 4,
                    timeRan: 2,
                    percentageCompleted: 100
                }];
            this.outputProcesses.forEach(process => {
                this.simulatePending(process);
                this.simulateRunning(process);
            })
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
                            runningProcess.innerHTML = Math.round((100 * width) / time) + '%';
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
                    this.$emit('process-running-completed', true);
                }
            }, (process.arrivalTime + process.waitingTime + process.timeRan) * 1000);
            this.timeOuts.push(t);
        },
    },
}
</script>

<style scoped>
.parent {
    display: flex;
    flex-direction: row;
    border: 2px solid #42b883;
    text-align: center;
    border-radius: 12px;
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
}

.runningProcesses {
    margin-top: 20px;
    margin-bottom: 20px;
    min-height: 150px;
    border: 2px solid #42b883;
    margin: 5px;
    border-radius: 12px;
}

.runningProcess {
    margin: auto;
    color: white;
    margin: 5px;
    border-radius: 5px;
}

.child {
    flex-grow: 1;
}

.label {
    color: white;
}

.runningLabel {
    margin: 5px 2px;
    height: 25px;
    color: white;
    border-radius: 5px;
}

button {
    margin-top: 10px;
}

input {
    margin-bottom: 5px;
}
</style>