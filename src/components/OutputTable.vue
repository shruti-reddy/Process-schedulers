<script>
import calculateOutputForFCFS from '@/helpers/fcfs';
import calculateOutputForSJF from '@/helpers/sjf';
export default {
    name: 'output-table',
    props: {
        algorithm: String,
        processes: Array,
    },
    emits: ["processStarted"],
    data() {
        return {
            outputProcesses: [],
        }
    },
    methods: {
        calculateOutputs() {
            switch (this.algorithm) {
                case 'FCFS':
                    this.outputProcesses = calculateOutputForFCFS(this.processes);
                    break;
                case 'SJF':
                    this.outputProcesses = calculateOutputForSJF(this.processes);
                    break;
            }
        },
        
        calculateOutputForSJF() {
            // Sort processes by arrival time
            this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

            let totalWaitingTime = 0;
            let totalTurnaroundTime = 0;
            let completionTime = 0;

            let currentTime = 0;
            // let totalWaitingTime = 0;
            let n = this.processes.length;

            debugger;
            for (let i = 0; i < n; i++) {
                let shortestIndex = i;
                // Find the shortest job that has arrived
                for (let j = i + 1; j < n; j++) {
                    if (this.processes[j].arrivalTime <= currentTime && this.processes[j].burstTime < this.processes[shortestIndex].burstTime) {
                        shortestIndex = j;
                    }
                }
                

                // Execute the shortest job
                let outputProcess = {... this.processes[shortestIndex]};
                currentTime += outputProcess.burstTime;
                outputProcess.completionTime = currentTime;
                outputProcess.turnAroundTime = outputProcess.completionTime - outputProcess.arrivalTime;
                outputProcess.waitingTime = outputProcess.turnAroundTime - outputProcess.burstTime>0 ? outputProcess.turnAroundTime - outputProcess.burstTime:0;

                // Swap the shortest job with the current index
                this.outputProcesses.push(outputProcess);
            }

            // Calculate total waiting time
            for (let i = 0; i < n; i++) {
                totalWaitingTime += this.outputProcesses[i].waitingTime;
            }

            // Calculate average waiting time
            const avgWaitingTime = totalWaitingTime / n;
        },
        startClicked() {
            this.calculateOutputs();
            this.$emit('processStarted', true);
        }
    },
}
</script>

<template>
    <button v-on:click="startClicked">Start {{ algorithm }} algorithm</button>
    <div v-for="process in outputProcesses" :key="process.name" class="processes">
        <p>Name: {{ process.name }}</p>
        <p> Arrival Time: {{ process.arrivalTime }} </p>
        <p> Burst Time: {{ process.burstTime }} </p>
        <p> Waiting Time: {{ process.waitingTime }}</p>
        <p> Turn Around Time: {{ process.turnAroundTime }} </p>
        <p> Completion Time: {{ process.completionTime }} </p>
    </div>

</template>

<style scoped>
.processes {
    display: flex;
    flex-direction: row;
}

button{
    width: 20%;
}
</style>