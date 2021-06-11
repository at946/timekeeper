<template>
  <div>
    <div class="timer mt-10 mb-5 px-4 py-2">
      <input  type="number"
              v-model="minute"
              id="minute"
              placeholder="mm"
              min="0"
              max="60"
              :readonly="timerIsRunning"
              @change="focusOutTimer"
      >
      <span>:</span>
      <input  type="number"
              v-model="second"
              id="second"
              placeholder="ss"
              min="0"
              max="59"
              :readonly="timerIsRunning"
              @change="focusOutTimer"
      >
    </div>
    <div>
      <button
        id="button_start"
        class="button"
        :disabled="(Number(this.minute) * 60 + Number(this.second)) <= 0 || timerIsRunning"
        @click="startTimer"
      >
        <fa :icon="faPlay" />
      </button>

      <button
        id="button_stop"
        class="button"
        :disabled="!timerIsRunning"
        @click="stopTimer"
      >
        <fa :icon="faPause" />
      </button>
      <button
        id="button_reset"
        class="button"
        :disabled="originTime == 0 || originTime == time || timerIsRunning"
        @click="resetTimer"
      >
        <fa :icon="faUndo" />
      </button>
    </div>
  </div>
</template>

<script>
import Push from 'push.js'
import { faPlay, faPause, faUndo } from '@fortawesome/free-solid-svg-icons'

export default {
  data() {
    return {
      minute: '00',
      second: '00',
      timer: '',
      time: 0,
      originTime: 0,
      timerIsRunning: false,
      timerIsSet: false
    }
  },

  head() {
    return {
      title: `${this.minute}:${this.second} | timekeeper`
    }
  },

  mounted() {
    Push.Permission.request()
  },

  computed: {
    faPlay()  { return faPlay },
    faPause() { return faPause },
    faUndo()  { return faUndo }
  },

  methods: {
    focusOutTimer () {
      this.time = Number(this.minute) * 60 + Number(this.second)
      this.timeToMinSec()
      this.timerIsSet = true
    },

    timeToMinSec () {
      if (this.time < 3600) {
        this.second = ('00' + this.time % 60).slice(-2)
        this.minute = ('00' + (this.time - this.second) / 60).slice(-2)
      } else {
        this.minute = '60'
        this.second = '00'
      }
    },

    startTimer () {
      if  (this.timerIsSet) { this.originTime = this.time }
      // 1秒ごとにカウントダウンする
      this.timer = setInterval(() => {
        this.time -= 1
        this.timeToMinSec()
        if (this.time < 1) {
          this.stopTimer()
          Push.create('Time is up!!', {
            onClick: function () {
              window.focus()
              this.close()
            }
          })
        }
      }, 1000)
      // タイマー動作中のステータスに更新する
      this.timerIsRunning = true
      this.timerIsSet = false
    },

    stopTimer () {
      // カウントダウンを停止する
      clearInterval(this.timer)
      // タイマーを停止中のステータスに更新する
      this.timerIsRunning = false
    },

    resetTimer () {
      this.time = this.originTime
      this.timeToMinSec()
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  font-size: 5rem;
}

.timer {
  @media screen and (max-width: 416px) { font-size: 3rem; }
  @media screen and (min-width: 417px) { font-size: 5rem; }
  display: inline-block;

  input {
    @media screen and (max-width: 416px) { width: 80px; }
    @media screen and (min-width: 417px) { width: 120px; }
    &::-webkit-inner-spin-button, &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
      -moz-appearance: textfield;
    }
  }
}
</style>