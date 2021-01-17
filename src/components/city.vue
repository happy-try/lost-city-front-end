<template>
  <div style="margin-bottom: 10px">
    <a-row>
      <a-col :span="10">
        <Card v-for="card in playPing"
          :id="card.id"
          :key="card.value"
          :color="card.color"
          :type="card.type"
          :value="card.value"
        >
        </Card>
      </a-col>
      <a-col :span="4">
        <div class="c-name" :style="{ backgroundColor: color }">
          {{ name }}
        </div>
        <a-button type="dashed" ghost style="width: 60px; margin-left: -10px;" @click="toPick">
          {{ showLastInrecycleBin }}
        </a-button>
      </a-col>
      <a-col :span="10">
        <Card v-for="card in playPong"
          :id="card.id"
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
    playPing: {
      default: () => {
        return []
      }
    },
    playPong: {
      default: () => {
        return []
      }
    },
    recycleBin: {
      default: () => {
        return []
      }
    }
  },
  computed: {
    lastInrecycleBin() {
      return this.recycleBin[this.recycleBin.length - 1]
    },
    showLastInrecycleBin() {
      return this.lastInrecycleBin ? (this.lastInrecycleBin.value === 0 ? '投' : this.lastInrecycleBin.value) : '空'
    }
  },
  methods: {
    playerPing() {

    },
    playerPong() {
    },
    toPick() {
      this.$emit('pickCard', true, this.name)
    }
  }
}
</script>

<style scoped>
  .c-name {
    padding: 24px;
    display: inline-block;
    width: 140px;
  }
</style>