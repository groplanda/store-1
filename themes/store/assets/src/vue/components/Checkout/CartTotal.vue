<template>
  <div class="checkout__total">
    <div class="checkout__total-row">
      <div class="checkout__total-label">Общая стоимость</div>
      <div class="checkout__total-val">{{ preparePrice(price.sum) }}</div>
    </div>
    <div class="checkout__total-row">
      <div class="checkout__total-label">Сумма скидки</div>
      <div class="checkout__total-val">{{ salePrice }}</div>
    </div>
    <div class="checkout__total-row" v-if="price.promocode">
      <div class="checkout__total-label">Скидка за промокод</div>
      <div class="checkout__total-val">{{ preparePrice(price.promocode) }}</div>
    </div>
    <div class="checkout__total-row">
      <div class="checkout__total-label checkout__total-label_sum">Итого</div>
      <div class="checkout__total-val checkout__total-val_sum">{{ preparePrice(price.total) }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "CartTotal",
  props: {
    price: {
      type: Object,
      required: true
    }
  },
  computed: {
    salePrice() {
      return (this.price.sum - this.price.total).toLocaleString('ru') + ' ₽';
    }
  },
  methods: {
    preparePrice(price) {
      return price.toLocaleString('ru') + ' ₽';
    }
  }
}
</script>