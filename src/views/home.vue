<template>
  <div style="height: 100%;">
    <a-row type="flex" justify="space-around" align="middle">
      <a-col :span="8">
        col-8
      </a-col>
      <a-col :span="8">
        <div>
          <a-input
            v-model:value="room"
            placeholder="请输入关键词，用于创建房间"
            allow-clear
          />

          <a-input
            style="margin-top: 10px;"
            v-model:value="player"
            placeholder="请输入你的大名"
            allow-clear
          />

          <a-button size="large" @click="toRoom" style="margin-right: 20px;">进入房间</a-button>
        </div>
      </a-col>
      <a-col :span="8">
        col-8
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()

    const room = ref("")
    const player = ref("")

    const toRoom = () => {
      if (!room.value || !player.value) {
        message.error("把框填全啊....", 2)
        return
      }

      router.push({
        name: 'game',
        query: {
          room: escape(Base64.encode(room.value)),
          player: escape(Base64.encode(player.value))
        }
      })
    }

    return {
      room,
      player,
      toRoom
    }
  }
}
</script>

<style>
  body {
    background-color: burlywood;
    height: 100%;
  }
</style>