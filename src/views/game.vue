<template>
  <div>
    <div>{{room}}:{{currentPlayer}}</div>
    <div v-if="initDone" class="game-content">
      <a-row>
        <a-col :span="10">
          <div v-if="nextPlayer === 'player_ping'">
            轮到{{ players[0] }}，{{ nextActionText }}
          </div>
        </a-col>
        <a-col :span="4">
          <div class="c-name">
            牌堆:
          </div>
          <a-button type="dashed" ghost style="width: 60px; margin-left: -10px;" @click="toPick(false)">
            {{ leaveCount }}
          </a-button>
        </a-col>
        <a-col :span="10">
          <div v-if="nextPlayer === 'player_pong'">
            轮到{{ players[1] }}，{{ nextActionText }}
          </div>
        </a-col>
      </a-row>

      <City v-for="city in cities"
        :key="city.name"
        :name="city.name"
        :color="city.color"
        :playPing="citiesStatus[city.name]['player_ping']"
        :playPong="citiesStatus[city.name]['player_pong']"
        :recycleBin="citiesStatus[city.name]['recycle_bin']"
        @pickCard="toPick"
      >
      </City>

      <a-divider> 以下为手牌： </a-divider>

      <a-row>
        <a-col :span="16">
          <Card v-for="card in handCards"
            :key="card.id"
            :id="card.id"
            :color="card.color"
            :type="card.type"
            :value="card.value"
            :city="card.city"
            :isHand="true"
            :selectedHandCardId="selectedHandCardId"
            @trigger="triggerHandCard"
          >
          </Card>
        </a-col>
        <a-col :span="4">
          <a-button size="large" @click="toPlay" style="margin-right: 20px;">打出</a-button>
          <a-button type="danger" size="large" @click="toThrowAway">丢弃</a-button>
        </a-col>
      </a-row>
    </div>

    <a-spin v-if="waitting" />
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import City from '../components/city'
import Card from '../components/card'
import { message } from 'ant-design-vue'

export default {
  name: 'Game',
  components: {
    City,
    Card
  },
  data() {
    return {
      initDone: false,
      room: "",
      currentPlayer: "",
      players: [],
      playPing: "",
      playPong: "",
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
      citiesStatus: {},
      handCards: [],
      leaveCount: 0,
      selectedHandCard: {},
      selectedHandCardId: "",
      nextPlayer: "",
      nextAction: "",
      waitting: false // 等待中
    }
  },
  channels: {
    GameChannel: {
      connected() {
        console.info("connected...")
        this.intoRoom()
        // this.initDone = true
      },
      rejected() {
        console.info("rejected...")
      },
      received(data) {
        console.info(data)
        switch (data.type) {
          case 'fetch_current':
            this.handleData(data, () => {
              this.players = data.players
              this.playPing = data.players[0]
              this.playPong = data.players[1]
              this.handCards = data.hand_cards
              this.cities = data.cities
              this.citiesStatus = data.cities_status
              this.leaveCount = data.leave_count
              this.nextPlayer = data.next_player
              this.nextAction = data.next_action
              this.initDone = true
              this.waitting = false
            })
            break;
          case 'waitting':
            this.waitting = true
            break
          case 'game_over':
            break;
          default:
            break;
        }
      },
      disconnected() {
        console.info("disconnected...")
      }
    }
  },
  mounted() {
    console.info(this.$route.query)
    this.room = Base64.decode(unescape(this.$route.query.room))
    this.currentPlayer = Base64.decode(unescape(this.$route.query.player))

    this.$cable.subscribe({
      channel: 'GameChannel',
      room: this.room,
      player: this.currentPlayer
    });
  },
  computed: {
    nextActionText() {
      return this.nextAction === "pick_card" ? "从弃牌堆 / 剩余牌堆选择一张" : "从手牌打出一张牌"
    }
  },
  methods: {
    toPlay() {
      // 选择牌投资到对应的城市
      this.pushCard(false)
    },
    toThrowAway() {
      // 选择牌丢弃到对应的城市
      this.pushCard(true)
    },
    toPick(isFromCity, city = '') {
      this.pickCard(isFromCity, city)
    },
    triggerHandCard(selected, cardId) {
      // 选中一张手牌时，样式进行变更：上移/下移
      if (selected) {
        this.selectedHandCardId = cardId
      } else {
        this.selectedHandCardId = ''
      }
    },
    intoRoom() {
      this.basePerform('into_room')
    },
    pushCard(throwAway) {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'push_card',
        data: {
          player: this.currentPlayer,
          card_id: this.selectedHandCardId,
          throw_away: throwAway
        }
      })
    },
    pickCard(isFromCity, city = '') {
      // fromCity：是否来自某个城市的弃牌队。true: 是； false：来自牌堆。
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'pick_card',
        data: {
          player: this.currentPlayer,
          if_from_city: isFromCity,
          city: city
        }
      })
    },
    basePerform(action, data) {
      this.$cable.perform({
        channel: 'GameChannel',
        action: action,
        data: data
      })
    },
    handleData(data, successHandler) {
      if (data.error_code > 10000) {
        message.error(data.error_msg, 2)
      } else {
        successHandler()
      }
    }
  }
}
</script>

<style>
  .game-content {
    padding: 10px;
    font-weight: bold;
  }

  .c-name {
    padding: 24px;
    display: inline-block;
    width: 140px;
  }
</style>