<template>
  <div>
    <div class="mb-2 mt-10">
      <select
        name="timer_type"
        id="timer_type"
        v-model="timerType"
        @change="clearTimer"
        :disabled="timerIsRunning"
      >
        <option value="countdown">カウントダウン</option>
        <option value="countup">カウントアップ</option>
      </select>
    </div>
    <div class="timer mb-2 px-4 py-2">
      <input  type="number"
              v-model="minute"
              id="minute"
              placeholder="mm"
              min="0"
              max="60"
              :readonly="timerIsRunning || timerType == 'countup'"
              @change="focusOutTimer"
      >
      <span>:</span>
      <input  type="number"
              v-model="second"
              id="second"
              placeholder="ss"
              min="0"
              max="59"
              :readonly="timerIsRunning || timerType == 'countup'"
              @change="focusOutTimer"
      >
    </div>
    <div>
      <button
        id="button_start"
        class="button"
        :disabled="(timerType == 'countdown' && (Number(this.minute) * 60 + Number(this.second)) <= 0) || timerIsRunning"
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
        :disabled="(timerType == 'countdown' && (originTime == 0 || originTime == time)) || (timerType == 'countup' && time == 0) || timerIsRunning"
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
      endTime: 0,
      startTime: 0,
      originTime: 0,
      timerIsRunning: false,
      timerIsSet: false,
      timerType: 'countdown'
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
      if (this.timerIsSet) { this.originTime = this.time }
      if (this.timerType == 'countdown') {
        // 1秒ごとにカウントダウンする
        this.endTime = Date.now() + (this.time * 1000)
        this.timer = setInterval(() => {
          this.time = Math.round((this.endTime - Date.now()) / 1000)
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
      } else if (this.timerType == 'countup') {
        // 1秒ごとにカウントアップする
        this.startTime = Date.now() - this.time * 1000
        this.timer = setInterval(() => {
          this.time = Math.round((Date.now() - this.startTime) / 1000)
          this.timeToMinSec()
        }, 1000)
      }
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
      if (this.timerType == 'countdown') { this.time = this.originTime }
      else if (this.timerType == 'countup') { this.time = 0}
      this.timeToMinSec()
    },

    clearTimer () {
      this.time = 0
      this.timeToMinSec()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_spacing.scss';
@import '@/assets/css/_color.scss';

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

select {
  @extend .px-3;
  @extend .py-1;
  border-width: 1px;
  border-radius: 2rem;
  border-color: $primary;

  &:hover, &:focus {
    border-color: darken($primary, 15%);
  }

  &:disabled {
    &:hover, &:focus {
      border-color: $primary;
    }
  }
}
</style>