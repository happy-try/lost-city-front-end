<template>
  <div style="background-color: #79cece; padding: 10px;">
    <div v-if="operation.action === 'pick_card'">
      <div v-if="operation.if_from_city" >
        {{ `${operation.player} 从「弃牌堆」取回了一张` }}
        <Card
          :id="operation.card.id"
          :color="operation.card.color"
          :type="operation.card.type"
          :value="operation.card.value"
        >
        </Card>
      </div>
      <div v-else>
        {{ `${operation.player} 从「剩余牌组」抽了一张牌` }}
      </div>
    </div>

    <div v-else-if="operation.action === 'push_card'">
      <div v-if="operation.throw_away">
        {{ `${operation.player} 丢弃了一张牌到「弃牌堆」` }}
        <Card
          :id="operation.card.id"
          :color="operation.card.color"
          :type="operation.card.type"
          :value="operation.card.value"
        >
        </Card>
      </div>
      <div v-else>
        {{ `${operation.player} 从打出了一张牌` }}
        <Card
          :id="operation.card.id"
          :color="operation.card.color"
          :type="operation.card.type"
          :value="operation.card.value"
        >
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './card'

export default {
  name: 'RecentOperation',
  components: {
    Card
  },
  data() {
    return {
    }
  },
  props: {
    operation: {
      require: true,
      type: Object
    }
  }
}
</script>

<style>

</style>