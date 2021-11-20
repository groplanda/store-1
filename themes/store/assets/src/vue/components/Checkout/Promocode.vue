<template>
  <div class="checkout__promo">
    <div class="checkout__promo-form">
      <input type="text" v-model="name" placeholder="Код купона" class="checkout__promo-input" />
      <button type="button" class="button checkout__promo-button" @click.stop="onSend">Применить</button>
      <div class="checkout__promo-result" :class="resultClass">{{ title }}</div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "Promocode",
  props: {
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      name: "",
      title: "",
      result: ""
    }
  },
  computed: {
    resultClass() {
      return {
        "checkout__promo-result_success": this.result === "success",
        "checkout__promo-result_error": this.result === "error"
      }
    },
    isValidate() {
      return this.name.length > 1;
    }
  },
  methods: {
    onSend() {
      if (!this.isValidate) return;

      const data = {
        'name': this.name,
        'total': this.total
      }
      axios.post('/api/promocode/add', data)
        .then(response => {
          const data = response.data;
          this.result = data.status;
          this.title = data.message

          if(data.status === 'success') {
            this.$emit('setPromo', data.promocode);
          }
        })
        .catch(error => {
          console.log(error);
        })
    },
  }
}
</script>
