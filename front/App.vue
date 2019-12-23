<template>
  <div>
    <textarea v-model="input"></textarea>
    <button @click="apply">Apply</button>
  </div>
</template>
<script>
const vscode = acquireVsCodeApi();
export default {
  data() {
    return {
      input: ""
    };
  },
  methods: {
    apply() {
      vscode.postMessage({
        command: "alert",
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