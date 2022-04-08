<template>
  <div class="checkout__total">
    <div class="checkout__total-title" v-if="count">Корзина {{count}}</div>
    <div class="checkout__total-list" v-if="count">
      <div class="checkout__total-row">
        <div class="checkout__total-label"><span class="checkout__total-bg">Сумма заказа</span></div>
        <div class="checkout__total-value">{{ sum.toLocaleString('ru') + ' ₽' }}</div>
      </div>
      <div class="checkout__total-row">
        <div class="checkout__total-label"><span class="checkout__total-bg">Скидка</span></div>
        <div class="checkout__total-value">{{ sale.toLocaleString('ru') + ' ₽' }}</div>
      </div>
      <div class="checkout__total-row">
        <div class="checkout__total-label"><span class="checkout__total-bg">Итого</span></div>
        <div class="checkout__total-value">{{ total.toLocaleString('ru') + ' ₽' }}</div>
      </div>
    </div>
    <div class="checkout__total-bottom">
      <button type="submit" form="order" class="checkout__total-submit button" :class="disabledSend">Сделать заказ</button>
      <p class="checkout__total-privacy">
        Нажимая на кнопку, я соглашаюсь c
        <a href="#" data-js-action="open-modal" data-name="privacy" data-title="Политика конфиденциальности" class="checkout__total-link">политикой конфиденциальности</a>.
      </p>
    </div>
  </div>
</template>
<script>
import { choseWordForm } from "@/src/helpers/prepare.js";

export default {
  name: "TotalItem",
  computed: {
    count() {
      const count = this.$store.getters.getProductCount;
      return (
        count +
        " " +
        choseWordForm(count, "товар", "товара", "товаров")
      );
    },
    total() {
      return this.$store.getters.getTotal
    },
    sum() {
      return this.$store.getters.getSum
    },
    sale() {
      return +this.sum - +this.total;
    },
    disabledSend() {
      return {
        'checkout__total-submit_disabled': !this.total

      }
    }
  }
}
</script>
