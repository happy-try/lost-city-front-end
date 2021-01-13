<template>
  <div>
    <City v-for="city in cities"
      :key="city.name"
      :name="city.name"
      :color="city.color"
      :queueOne="city.queueOne"
      :queueTwo="city.queueTwo"
    >
    </City>

    <a-divider> 以下为手牌： </a-divider>

    <a-row>
      <a-col :span="16">
        <Card v-for="card in handCards"
          :key="card.value"
          :color="card.color"
          :type="card.type"
          :value="card.value"
        >
        </Card>
      </a-col>
      <a-col :span="2">
        <a-button type="primary" @click="toPlay">打出</a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import City from './city'
import Card from './card'

export default {
  name: 'Game',
  components: {
    City,
    Card
  },
  data() {
    return {
      cities: [
        {
          name: '金字塔',
          color: 'yellow',
          queueOne: [ { value: 2, color: 'yellow', type: 'normal', belong: '金字塔' }],
          queueTwo: [ { value: 5, color: 'yellow', type: 'normal', belong: '金字塔' }, { value: 7, color: 'yellow', type: 'normal', belong: '金字塔' }]
        },
        {
          name: '亚马逊雨林',
          color: 'green',
          queueOne: [ { value: 2, color: 'green', type: 'normal' }, { value: '投资', color: 'green', type: 'normal' }],
          queueTwo: [ { value: 5, color: 'green', type: 'normal' }, { value: 7, color: 'green', type: 'normal' }]
        },
        {
          name: '撒哈拉沙漠',
          color: 'red',
          queueOne: [ { value: 2, color: 'red', type: 'normal' }],
          queueTwo: [ { value: 5, color: 'red', type: 'normal' }, { value: 7, color: 'red', type: 'normal' }]
        },
        {
          name: '喜马拉雅山',
          color: 'yellow',
          queueOne: [ { value: 2, color: 'yellow', type: 'normal' }],
          queueTwo: [ { value: 5, color: 'yellow', type: 'normal' }, { value: 7, color: 'yellow', type: 'normal' }]
        },
        {
          name: '西伯利亚',
          color: 'green',
          queueOne: [ { value: 2, color: 'green', type: 'normal' }],
          queueTwo: [ { value: 5, color: 'green', type: 'normal' }, { value: 7, color: 'green', type: 'normal' }]
        }
      ],
      handCards: [
        { value: 3, color: 'yellow', type: 'normal', belong: '金字塔' },
        { value: 5, color: 'yellow', type: 'normal', belong: '金字塔' }
      ],
      selectedHandCard: {},
      value1: 'a',
      message: 'Hello world'
    }
  },
  channels: {
    GameChannel: {
      connected() {
        console.info("connected...")
      },
      rejected() {
        console.info("rejected...")
      },
      received(data) {
        console.info(data)
      },
      disconnected() {
        console.info("disconnected...")
      }
    }
  },
  mounted() {
    this.$cable.subscribe({
      channel: 'GameChannel',
      room: 'oWT2-3Bv'
    });
  },
  methods: {
    toPlay() {
      this.selectedHandCard = this.handCards.pop

      // 选择城市，推入队列
      this.pushCard()
    },
    pushCard() {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'push_card',
        data: {
          card_id: '1'
        }
      })
    }
  }
}
</script>

<style>

</style>