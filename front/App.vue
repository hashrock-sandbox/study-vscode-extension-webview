<template>
  <div>
    <textarea v-model="input"></textarea>
    <button @click="apply">Apply</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: ""
    };
  },
  methods: {
    apply() {}
  }
};
</script>