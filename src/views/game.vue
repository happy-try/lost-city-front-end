<template>
  <div>
    <div class="header">
      <a-row>
        <a-col :span="4">
          <a-button size="large" @click="showRule" style="margin-right: 20px;">查看规则</a-button>
          <a-button size="large" @click="toNewOne" style="margin-right: 20px;">重开一局</a-button>
        </a-col>
        <a-col :span="20">
          <RecentOperation :operation="recentOperation"></RecentOperation>
        </a-col>
      </a-row>
    </div>

    <a-divider> 以下为展示区： </a-divider>

    <!-- <div style="">{{room}}:{{currentPlayer}}</div> -->
    <div v-if="initDone" class="game-content">
      <a-row>
        <a-col :span="10">
          <div v-if="nextPlayer === 'player_ping'" style="background-color: #79cece; padding: 20px;">
            轮到{{ players[0] }}，{{ nextActionText }}
          </div>
        </a-col>
        <a-col :span="4">
          <div class="c-name">
            <span style="font-size: 18px;">牌堆:</span>
          </div>
          <a-button type="dashed" ghost style="width: 60px; margin-left: -10px;" @click="toPick(false)">
            <span style="font-size: 18px;">{{ leaveCount }}</span>
          </a-button>
        </a-col>
        <a-col :span="10">
          <div v-if="nextPlayer === 'player_pong'" style="background-color: #79cece; padding: 20px;">
            轮到{{ players[1] }}，{{ nextActionText }}
          </div>
        </a-col>
      </a-row>

      <City v-for="city in cities"
        :key="city.name"
        :name="city.name"
        :color="city.color"
        :playerPing="citiesStatus[city.name]['player_ping']"
        :playerPong="citiesStatus[city.name]['player_pong']"
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
    <a-modal v-model:visible="finished"
      title="游戏结束，比分如下："
      :maskClosable="false"
      :bodyStyle="{ padding: '48px', textAlign: 'center', 'fontSize': '28px' }"
    >
      <a-row>
        <a-col style="font-size: 10px;" :span="8">
          <span>「{{ players[0] }}」</span>
        </a-col>
        <a-col :span="8">
        </a-col>
        <a-col style="font-size: 12px;" :span="8">
          <span>「{{ players[1] }}」</span>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <span>{{ playerScore.playerPing }}</span>
        </a-col>
        <a-col :span="8">
          vs
        </a-col>
        <a-col :span="8">
          <span>{{ playerScore.playerPong }}</span>
        </a-col>
      </a-row>
      <template #footer>
        <a-button size="large" type="primary" @click="toNewOne">再来一局</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import City from '../components/city'
import Card from '../components/card'
import RecentOperation from '../components/recentOperation'
import { notification, Modal } from 'ant-design-vue'
import { h } from 'vue'
import { computeScore } from '../utils/game'

export default {
  name: 'Game',
  components: {
    City,
    Card,
    RecentOperation
  },
  data() {
    return {
      initDone: false,
      room: "",
      currentPlayer: "",
      players: [],
      playerPing: "",
      playerPong: "",
      cities: [],
      citiesStatus: {},
      handCards: [],
      leaveCount: 0,
      selectedHandCard: {},
      selectedHandCardId: "",
      nextPlayer: "",
      nextAction: "",
      recentOperation: {},
      waitting: false, // 等待中
      finished: false // 是否结束
    }
  },
  channels: {
    GameChannel: {
      connected() {
        console.info("connected...")
        this.intoRoom()
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
              this.playerPing = data.players[0]
              this.playerPong = data.players[1]
              this.handCards = data.hand_cards
              this.cities = data.cities
              this.citiesStatus = data.cities_status
              this.leaveCount = data.leave_count
              this.nextPlayer = data.next_player
              this.nextAction = data.next_action
              this.initDone = true
              this.waitting = false
              this.finished = data.finished
            })
            break;
          case 'waitting':
            this.waitting = true
            break
          case 'game_over':
            this.finished = true
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
    },
    playerScore() {
      // 计分
      let playerPingScore = 0
      let playerPongScore = 0

      Object.keys(this.citiesStatus).forEach(city => {
        playerPingScore += computeScore(this.citiesStatus[city].player_ping)
        playerPongScore += computeScore(this.citiesStatus[city].player_pong)
      })

      return {
        playerPing: playerPingScore,
        playerPong: playerPongScore
      }
    }
  },
  methods: {
    showRule() {
      Modal.info({
        title: '规则说明',
        content: h('div', {}, [
          h('p', '● 45 张远征卡：5种颜色各9张，数字2~10'),
          h('p', '● 15 张投资卡：5种颜色各3张'),
          h('p', '出牌，有2种选择:'),
          h('p', '● 将一张牌打到对应区域（对应颜色），不能比上一张牌的点数小（也就是递增），用于计分'),
          h('p', '● 或者，将一张牌丢到对应区域弃牌堆，不做计分'),
          h('p', '抽牌，有2种选择'),
          h('p', '● 从对应区域的弃牌堆里拿回一张牌。'),
          h('p', '● 或者，从剩余的牌组里拿回一张牌。'),
          h('a', { href: 'https://blog.xuite.net/tacox0127/rx002/21740127-%5B%E8%A6%8F%E5%89%87%5D+%E5%A4%B1%E8%90%BD%E5%9F%8E%E5%B8%82+Lost+Cities', target: '_blank' }, '详细规则' )
        ]),
        onOk() {},
      })
    },
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
    toNewOne() {
      this.newOne()
      this.finished = false

      notification.open({
          message: '操作提示',
          description: '游戏已经重开',
          duration: 5,
          placement: 'topRight'
        })
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
          if_from_city: isFromCity,
          city: city
        }
      })
    },
    newOne() {
      this.$cable.perform({
        channel: 'GameChannel',
        action: 'new_one'
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
        // message.error(data.error_msg, 2)
        notification.open({
          message: '操作提示',
          description: data.error_msg,
          duration: 3,
          placement: 'topRight'
        })
      } else {
        successHandler()

        if (!data.recent_operation || Object.keys(data.recent_operation) === 0) {
          return
        }

        this.recentOperation = data.recent_operation

        // notification.open({
        //   message: '操作提示',
        //   description: h('div', {}, [
        //     h(RecentOperation, { operation: data.recent_operation }),
        //   ]),
        //   duration: 3,
        //   placement: 'topLeft'
        // })
      }
    }
  }
}
</script>

<style>
  .header {
    margin: 20px;
    height: 100px;
  }
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