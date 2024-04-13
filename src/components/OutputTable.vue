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