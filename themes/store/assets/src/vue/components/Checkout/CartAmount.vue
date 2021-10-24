<template>
  <div class="checkout__cart-item-control">
    <button
      @click="changeAmount"
      data-js-action="minus"
      :disabled="currentAmount === 1"
      type="button"
      :class="{ 'checkout__cart-item-btn_disabled': currentAmount === 1 }"
      class="checkout__cart-item-btn">
      <svg class="checkout__cart-item-ico" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <input type="number" class="checkout__cart-item-input" v-model="currentAmount" readonly />
    <button
      @click="changeAmount"
      data-js-action="plus"
      type="button"
      class="checkout__cart-item-btn">
      <svg class="checkout__cart-item-ico" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 12L8 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>
<script>
export default {
  name: "CartAmount",
  props: {
    amount: {
      type: Number,
      default: 1
    }
  },
  watch: {
    amount() {
      this.currentAmount = this.amount;
    }
  },
  data() {
    return {
      currentAmount: this.amount
    }
  },
  methods: {
    changeAmount(e) {
      if (e.target.dataset.jsAction === "plus" && this.currentAmount < 100) {
        this.currentAmount = this.currentAmount + 1;
      } else if (e.target.dataset.jsAction === "minus" && this.currentAmount > 1) {
        this.currentAmount = this.currentAmount - 1;
      }
      this.$emit("changeAmount", this.currentAmount);
    }
  }
}
</script>
