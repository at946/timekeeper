<template>
  <footer class="py-2">
    <div class="mb-2">
      <button class="wrapper-icon p-1" @click="shareToTwitter">
        <fa :icon="faTwitter" class="text-twitter" />
      </button>
    </div>
    created by <a href="https://twitter.com/at_946" target="_blank" class="text-twitter">at946</a>
  </footer>
</template>

<script>
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

export default {
  computed: {
    faTwitter() { return faTwitter }
  },

  methods: {
    shareToTwitter() {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent('timekeeper #timekeeper')}&url=${encodeURIComponent(window.location.origin)}`,
        "_blank"
      )
    }
  }
}
</script>