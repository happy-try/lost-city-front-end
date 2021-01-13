<template>
  <div class="card" :style="{ backgroundColor: color }">
    {{ value }}
  </div>
</template>

<script>
export default {
  name: 'Card',
  data() {
    return {
    }
  },
  props: {
    value: {
      require: true,
      type: Number
    },
    color: {
      require: true,
      type: String
    },
    type: {
      require: true,
      type: String
    }
  },
  computed: {
    isNormal() {
      return this.type === "normal"
    }
  },
  methods: {
    xx() {

    }
  }
}
</script>

<style scoped>
  .card {
    width: 80px;
    padding: 24px;
    margin: 0 10px;
    /* height: 100px; */
    display: inline-block;
    border: 2px;
  }
</style>
