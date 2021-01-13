<template>
  <div style="margin-bottom: 30px">
    <a-row>
      <a-col :span="10">
        <Card v-for="card in queueOne"
          :key="card.value"
          :color="card.color"
          :type="card.type"
          :value="card.value"
        >
        </Card>
      </a-col>
      <a-col :span="4">
        <div class="c-name" :style="{ backgroundColor: color }"> {{ name }} </div>
      </a-col>
      <a-col :span="10">
        <Card v-for="card in queueTwo"
          :key="card.value"
          :color="card.color"
          :type="card.type"
          :value="card.value"
        >
        </Card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Card from './card'

export default {
  name: 'City',
  components: {
    Card
  },
  data() {
    return {
    }
  },
  props: {
    name: {
      require: true,
      type: String
    },
    color: {
      require: true,
      type: String
    },
    queueOne: {
      default: () => {
        return []
      }
    },
    queueTwo: {
      default: () => {
        return []
      }
    }
  },
  methods: {
    xx() {

    }
  }
}
</script>

<style scoped>
  .c-name {
    padding: 24px;
  }
</style>