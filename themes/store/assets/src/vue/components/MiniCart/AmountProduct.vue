<template>
  <div class="product-amount">
    <button
      type="button"
      data-js-action="minus"
      class="product-amount__btn"
      @click="changeAmount"
      :disabled="currentAmount === 1"
    >
      <svg class="product-amount__btn-ico icon-minus">
        <use :xlink:href="$sprite_path + '#sprite-minus'"></use>
      </svg>
    </button>
    <input type="number" class="product-amount__val" v-model="currentAmount" readonly />
    <button
      @click="changeAmount"
      data-js-action="plus"
      type="button"
      class="product-amount__btn"
    >
      <svg class="product-amount__btn-ico icon-plus">
        <use :xlink:href="$sprite_path + '#sprite-plus'"></use>
      </svg>
    </button>
  </div>
</template>
<script>
export default {
  name: "AmountProduct",
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
};
</script>

