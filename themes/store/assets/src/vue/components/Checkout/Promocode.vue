<template>
  <div class="checkout__promo">
    <div class="title title_sm checkout__cart-title checkout__cart-title_promo" :class="resultClass">{{ title }}</div>
    <div class="checkout__promo-form">
      <input type="text" v-model="name" placeholder="Код купона" class="checkout__step-input checkout__step-input_promo" />
      <button type="button" class="button button_primary checkout__promo-button" @click="onSend">Применить</button>
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
      title: "У вас есть промокод?",
      result: ""
    }
  },
  computed: {
    resultClass() {
      return {
        "checkout__cart-title_success": this.result === "success",
        "checkout__cart-title_error": this.result === "error"
      }
    },
    noDisabledSend() {
      return this.name.length < 1 || (this.result !== "success" || this.result !== "");
    }
  },
  methods: {
    onSend() {
      if (!this.noDisabledSend) return;

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
