<template>
    <div v-if="outputProcesses.length>0" class="parent">
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
                    <div class="runningProcess" id="running-pp"
                        :style="{ backgroundColor: process.color, width: '0%' }">0%
                    </div>
                </div>
            </div>
        </div>
        <div class="child">
            <h1>Waiting</h1>
            <div class="processes">
                <div v-for="(process, index) in pending" :key="index" class="process"
                    :style="{ backgroundColor: process.color, width: process.percentageCompleted }">
                    <div class="label">{{ process.name }}: {{ process.burstTime }} : {{ process.percentageBeforeStart }}%</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import calculateOutputForRR from "@/helpers/RoundRobin";
import calculateOutputForPriorityScheduling from "@/helpers/PriorityScheduling";
export default {
    props: {
        inputProcesses: Array,
        selectedAlgorithm: String,
        isProcessRunning: Boolean,
        quantum: Number,
    },
    data() {
        return {
            outputProcesses: [],
            pending: [],
            running: [],
            completed: [],
            timeOuts: [],
            assignedColors: {},
            pendingNames: [],
        }
    },
    watch: {
        isProcessRunning: function (newVal) {
            if (newVal) {
                this.resetCurrents();
                this.runPreemptive();
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
            this.outputProcesses = [];
            this.timeOuts.forEach(timeout => {
                clearTimeout(timeout);
            });
        },
        runPreemptive() {
            if(this.selectedAlgorithm == 'Round Robin') {
                this.outputProcesses = calculateOutputForRR(this.inputProcesses, this.quantum)[3];
            }
            else {
                this.outputProcesses = calculateOutputForPriorityScheduling(this.inputProcesses)[3];
            }

            this.outputProcesses.forEach((process) => {
                if (process.name in this.assignedColors) {
                    process.color = this.assignedColors[process.name]
                    return;
                }
                process.color = this.generateRandomColor();
                this.assignedColors[process.name] = process.color;
            });

            this.outputProcesses.forEach(process => {
                this.simulatePending(process);
                this.simulateRunning(process);
                this.simulateCompleted(process);
            })
        },

        simulatePending(process) {
            const t = setTimeout(() => {
                this.pending.push(process);
            }, (process.lastExecutionTime) * 1000);
            this.timeOuts.push(t)
        },

        simulateRunning(process) {
            const t = setTimeout(() => {
                this.running = [process];
                this.pending = this.pending.filter((p) => p.name != process.name);
                this.$nextTick(() => {
                    const runningPp = document.getElementById("running-pp");
                    const id = setInterval(frame, 1000);
                    const time = process.burstTime;
                    let width = process.completedDuration;
                    function frame() {
                        if (width >= time) {
                            clearInterval(id);
                        } else {
                            width++;
                            const widthPercentage = (100 * width) / time + '%';
                            runningPp.style.width = widthPercentage;
                            runningPp.innerHTML = Math.round((100 * width) / time) + '%';
                        }
                    }
                })
            }, (process.startTime) * 1000);
            this.timeOuts.push(t);
        },

        simulateCompleted(process) {
            const t = setTimeout(() => {
                this.running = [];
                if (process.endPercentage !== 100) {
                    return;
                };
                this.completed.push(process);
                if (this.completed.length === this.inputProcesses.length) {
                    this.running = [];
                    this.$emit('process-running-completed', true);
                }
            }, (process.endTime) * 1000);
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
    transition: ease-in;
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