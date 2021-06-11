<template>
  <div style="display: flex; flex-direction: column; height: 100vh;">
    <main style="flex: 1;"><Nuxt /></main>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Footer
  }  
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Kosugi+Maru&display=swap');

@import '@/assets/css/_color.scss';
@import '@/assets/css/_spacing.scss';

html, body {
  font-family: 'Quicksand', 'Kosugi Maru', sans-serif;
  text-align: center;
  color: $black;
  background:$primary;
  margin: 0;
  padding: 0 .5rem;
}

.button {
  padding: 1rem 2rem;
  border-color: darken($primary, 15%);
  border-width: 1px;
  border-radius: 3rem;
  text-decoration: none!important;

  &:hover, &:focus {
    background: darken($primary, 15%);

    &:disabled {
      background: $primary;
    }
  }

  &:disabled {
    color: lighten($black, 50%);
    border-color: $primary;
  }
}

a {
  &:hover, &:focus {
    outline: none;
    text-decoration: underline;
  }
}

.wrapper-icons {
  display: inline-flex;
  align-items: center;
}
</style>
