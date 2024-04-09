<script>
export default {
    name: 'process-table',
    props: {
        algorithm: String,
    },
    data() {
        return {
            processes: [],
        }
    },
    methods: {
        inputChanged(event) {
            const totalProcess = event.target.value;
            this.processes = [];
            for(let i = 0; i < totalProcess; i++) {
                this.processes.push({
                    name: `P${i + 1}`,
                    arrivalTime: "",
                    burstTime: "",
                    priority: ""
                })
            }
        }
    },
}
</script>

<template>
    <div class="container">
        <h1>{{ algorithm }}</h1>
        <input placeholder="Enter number of processes" name="totalProcess" v-on:mouseleave="inputChanged"></input>
        <div v-for="process in processes" :key="process.name" class="flex-column">
            <div class="processes">
                <input placeholder="Enter process name" v-model="process.name"></input>
                <input placeholder="Enter Arrival time" v-model="process.arrivalTime"></input>
                <input placeholder="Enter Burst time" v-model="process.burstTime"></input>
            </div>
        </div>
    </div>
</template>

<style>
.container {
    margin: 20px 0;
    border: 1px solid grey;
    display: flex;
    flex-direction: column;
}
.flex-column {
    display: flex;
    flex-direction: row;
}
.processes {
    display: flex;
    flex-direction: row;
}
input {
    font-size: 14px;
    margin: 10px;
    padding: 14px;
    border: 1px solid #42b883;
    border-radius: 22px;
}
</style>