<template>
  <div class="card" :style="{ backgroundColor: color }" @click="trigger" :class="showClass">
    {{ value === 0 ? "投" : value }}
  </div>
</template>

<script>
export default {
  name: 'Card',
  data() {
    return {
      selected: false
    }
  },
  props: {
    id: {
      require: true,
      type: String
    },
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
    },
    isHand: {
      type: Boolean,
      default: false
    },
    selectedHandCardId: {
      type: String
    }
  },
  emits: [
    'trigger'
  ],
  computed: {
    isNormal() {
      return this.type === "normal"
    },
    showClass() {
      return this.selectedHandCardId === this.id ? "card-selected" : ""
    }
  },
  methods: {
    trigger() {
      // 手牌点击了才有效果
      if (this.isHand) {
        this.$emit('trigger', !this.selected, this.id)
      }
    }
  }
}
</script>

<style scoped>
  .card {
    width: 70px;
    padding: 24px;
    /* margin-right: -10px; */
    /* height: 100px; */
    display: inline-block;
    /* border: 2px; */
    border-radius: 50%;
    text-align: center;
  }

  .card-selected {
    border: 2px solid blue;
  }
</style>
