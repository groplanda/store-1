<template>
  <div class="qty qty_show qty_product">
    <button
      @click="changeAmount"
      data-js-action="minus"
      :disabled="currentAmount === minAmount"
      type="button"
      class="qty__btn qty__btn_remove"
      :class="{ 'qty__btn_disabled': currentAmount === minAmount }"
    >
      <svg class="qty__btn-ico" width="7" height="3" viewBox="0 0 7 3" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.205071 0.0799997H6.80507V2.576H0.205071V0.0799997Z" fill="currentColor"/>
      </svg>
    </button>
    <input type="number" class="qty__val qty__val_cart" v-model="currentAmount" readonly />
    <button
      type="button"
      @click="changeAmount"
      data-js-action="plus"
      class="qty__btn qty__btn_add"
    >
      <svg class="qty__btn-ico" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.65941 5.6H5.47341V8.75H3.54741V5.6H0.361406V3.8H3.54741V0.649999H5.47341V3.8H8.65941V5.6Z" fill="currentColor"/>
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
    },
    minAmount: {
      type: Number,
      default: 1
    },
    maxAmount: {
      type: Number,
      default: 50
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
      if (e.target.dataset.jsAction === "plus" && this.currentAmount < this.maxAmount) {
        this.currentAmount = this.currentAmount + 1;
      } else if (e.target.dataset.jsAction === "minus" && this.currentAmount > this.minAmount) {
        this.currentAmount = this.currentAmount - 1;
      }
      this.$emit("changeAmount", this.currentAmount);
    }
  }
}
</script>
