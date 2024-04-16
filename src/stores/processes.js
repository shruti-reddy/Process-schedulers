import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useProcessStore = defineStore('processes', {
  state: () => {
    return{
     pending: [],
     running:  [],
     completed: [],
  }
},
  
  actions : {
    updateRunning (process) {
      this.running.push(process)
    },
    updatePending (process) {
      this.pending.push(process)
    },
    updateCompleted (process) {
      this.completed.push(process);  
    },
  
    removeFromPending (process) {
      this.pending = this.pending.filter(p => p.name == process.name);
    },
  
    removeFromRunning (process) {
      this.running = this.running.filter(p => p.name == process.name);
    },
  },

  getters: {
    getRunning: (state) => {
      return state.running;
    },
    getPending: (state) => {
      return state.pending
    },
    getCompleted: (state) => {
      return state.completed;
    }
  }
  

  // return { pending, running, completed, updateRunning, updatePending, updateCompleted, removeFromPending, removeFromRunning }
})
