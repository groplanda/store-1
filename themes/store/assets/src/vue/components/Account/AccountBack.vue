<template>
  <div class="account__heading account__heading_start">
    <button class="account__heading-logout" type="button" @click="$emit('back')" alt="Назад">
      <svg class="account__heading-back">
        <use :xlink:href="$sprite_path + '#sprite-arrow-account'"></use>
      </svg>
    </button>
    <h1 class="title account__title">{{ title }}</h1>
  </div>
</template>
<script>
export default {
  name: "AccountBack",
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>
