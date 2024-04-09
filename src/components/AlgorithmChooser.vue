<script>
import ProcessTable from "../components/ProcessTable.vue";
export default {
    name: 'algorithm-chooser',
    components: {ProcessTable},
    data() {
        return {
            algorithms: [
                {
                    title: "FCFS",
                    description: "The first come first serve algorithm is a scheduling algorithm that schedules the processes in the order of their arrival in the ready queue.",
                    route: "/fcfs",
                },
                {
                    title: "SJF",
                    description: "The shortest job first algorithm is a scheduling algorithm that schedules the processes in the order of their burst time.",
                    route: "/sjf",
                },
                {
                    title: "Round Robin",
                    description: "The round robin algorithm is a scheduling algorithm that schedules the processes in the order of their arrival in the ready queue.",
                    route: "/roundrobins",
                },
            ],
            selectedAlgorithm: '',
        }
    },
    methods: {
        selectedAlgorithmChanged(algo) {
            this.selectedAlgorithm = algo.title;
            console.log(this.selectedAlgorithm)
        }
    }
}
</script>

<template>
    <h1><b>Select CPU shceduling algorithm</b></h1>
    <div class="container">
        <div class="card" v-for="algo in algorithms" :key="algo">
            <button class="title" v-on:click="selectedAlgorithmChanged(algo)">{{ algo.title }}</button>
            <p class="description">{{ algo.description }}</p>
        </div>
    </div>
    <ProcessTable :algorithm="selectedAlgorithm"/>
</template>

<style>
.container {
    display: flex;
    flex: row;
}

.title {
    background-color: #42b883;
    color: white;
    border-radius: 5px;
    border: 1px solid grey;
    font-size: larger;
    margin: 20px;
    width: 150px;
    height: 40px;
}

.title:hover + .description {
  display: block;
  color: rgb(43, 43, 99);
}

.button-selected {
    background-color: blue;
}

.description {
    display: none;
}
</style>