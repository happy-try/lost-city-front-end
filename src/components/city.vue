<template>
  <div style="margin-bottom: 10px">
    <a-row>
      <a-col :span="2">
        <div v-show="playerPingScore !== 0" class="c-name">
          {{ playerPingScore }}
        </div>
      </a-col>
      <a-col :span="8">
        <div style="text-align: right;">
          <Card
            v-for="card in playerPingShow"
            :key="card.value"
            :id="card.id"
            :color="card.color"
            :type="card.type"
            :value="card.value"
          >
          </Card>
        </div>

        <!-- <a-row type="flex" justify="end">
          <a-col :span="4" v-for="card in playerPingShow" :key="card.value">
            <Card
              :id="card.id"
              :color="card.color"
              :type="card.type"
              :value="card.value"
            >
            </Card>
          </a-col>
        </a-row> -->
      </a-col>
      <a-col :span="4">
        <div class="c-name" :style="{ backgroundColor: color }">
          <span style="font-size: 18px;">{{ name }}</span>
        </div>
        <a-button type="dashed" ghost style="width: 60px; height: 54px; margin-left: -10px;" @click="toPick">
          <span style="font-size: 24px; padding: 4px 4px;">{{ showLastInrecycleBin }}</span>
        </a-button>
      </a-col>
      <a-col :span="8">
        <div style="text-align: left;">
          <Card
            v-for="card in playerPong"
            :key="card.value"
            :id="card.id"
            :color="card.color"
            :type="card.type"
            :value="card.value"
          >
          </Card>
        </div>
        <!-- <a-row type="flex" justify="start">
          <a-col :span="4" v-for="card in playerPong" :key="card.value">
            <Card
              :id="card.id"
              :color="card.color"
              :type="card.type"
              :value="card.value"
            >
            </Card>
          </a-col>
        </a-row> -->
      </a-col>
      <a-col :span="2">
        <div v-show="playerPongScore !== 0" class="c-name">
          {{ playerPongScore }}
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Card from './card'
import { computeScore } from '../utils/game'

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
    playerPing: {
      default: () => {
        return []
      }
    },
    playerPong: {
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
    },
    playerPingScore() {
      return computeScore(this.playerPing)
    },
    playerPongScore() {
      return computeScore(this.playerPong)
    },
    playerPingShow() {
      // 左边选手的牌需要反向排序
      let reverseplayerPing = JSON.parse(JSON.stringify(this.playerPing))
      return reverseplayerPing.reverse()
    }
  },
  methods: {
    toPick() {
      this.$emit('pickCard', true, this.name)
    }
  }
}
</script>

<style scoped>
  .c-name {
    padding: 24px;
    width: 140px;
  }
</style>