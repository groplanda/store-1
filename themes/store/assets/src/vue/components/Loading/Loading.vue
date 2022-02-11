<template>
  <div class="loading loading_active" :class="loadingClass">
    <div class="loading__wrapper">
      <div class="loading__layer">
        <div class="loading__circle-clipper loading__circle-clipper--left">
          <div class="loading__circle"></div>
        </div>
        <div class="loading__gap-path">
          <div class="loading__circle"></div>
        </div>
        <div class="loading__circle-clipper loading__circle-clipper--right">
          <div class="loading__circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Loading",
  props: {
    isSearch: {
      type: Boolean,
      default: false
    },
    isWhite: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    loadingClass() {
      return {
        'loading_search': this.isSearch,
        'loading_white': this.isWhite
      }
    }
  }
}
</script>
