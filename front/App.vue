<template>
  <div>
    <!-- <textarea v-model="input"></textarea> -->
    <gantt :input="input" @change="update"></gantt>
    <!-- <button @click="apply">Apply</button> -->
  </div>
</template>
<script>
import Gantt from "./components/CodeBlockGantt.vue"

const vscode = acquireVsCodeApi();
export default {
  components: {
    Gantt
  },  
  data() {
    return {
      input: ""
    };
  },
  methods: {
    update(text){
      vscode.postMessage({
        command: "text",
        text: text
      });

    },
    apply() {
      vscode.postMessage({
        command: "text",
        text: this.input
      });
    }
  },
  mounted() {
    window.addEventListener("message", event => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case "text":
          this.input = message.text;
          break;
      }
    });
  }
};
</script>