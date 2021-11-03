<template>
  <div class="account__table-row">
    <div class="account__table-col account__table-col_info">
      Заказ №
      <span class="account__table-val">{{ order.name }}</span>
      <span v-if="orderStatus" :class="'account__table-status_' + orderStatus.id" class="account__table-status">{{ orderStatus.title }}</span>
    </div>
    <div class="account__table-col account__table-col_count">
      {{ productCount }} {{ labelCount }}
    </div>
    <div class="account__table-col account__table-col_delivery" v-if="paymentStatus">
      {{ paymentStatus.title }}
    </div>
    <div class="account__table-col account__table-col_total">
      <span class="account__table-total">{{ totalSum }}</span>
    </div>
    <button type="button" class="account__table-btn" @click="toggleProducts">
      <svg class="account__table-arrow" width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.175 0.533325L5 4.34999L8.825 0.533325L10 1.70833L5 6.70833L0 1.70833L1.175 0.533325Z" fill="#8C96A3"/>
      </svg>
    </button>

    <div class="account__table-products">

      <div class="account__table-row" v-for="(product, index) in order.products" :key="index">
        <div class="account__table-col account__table-col_info">
          <a :href="'/product/' + product.id" class="account__table-link">{{ product.title }} x {{ product.amount }}</a>
        </div>
        <div class="account__table-col account__table-col_total">
          <span class="account__table-total">{{ product.sale_price ? productPrice(product.sale_price) : productPrice(product.price) }}</span>
        </div>
      </div>

      <div class="account__table-row">
        <div class="account__table-col account__table-col_info">
          <button type="button" class="account__table-button button button_primary" @click="repeatOrder">Повторить заказ</button>
          <div class="account__table-error" v-if="message">{{ message }}</div>
        </div>
      </div>

    </div>

  </div>
</template>
<script>
import { choseWordForm } from "@/src/helpers/prepare.js";

export default {
  name: "AccountSingleOrder",
  data() {
    return {
      statuses: [
        { id: 'new', title: 'Новый' },
        { id: 'waiting', title: 'В ожидание оплаты' },
        { id: 'canceled', title: 'Оплата отменена' },
        { id: 'pay', title: 'Оплачен' },
        { id: 'work', title: 'В работе' },
        { id: 'finish', title: 'Выполнен' },
        { id: 'close', title: 'Закрыт' }
      ],
      paymentType: [
        { id: '0', title: 'Яндекс касса' },
        { id: '1', title: 'Картой при доставке' },
        { id: '2', title: 'Наличными при доставке' }
      ],
      message: ""
    }
  },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  computed: {
    productCount() {
      let result = 0
      if (this.order.products) {
        result = this.order.products.reduce((sum, product) => sum + product.amount, 0);
      }
      return result;
    },
    paymentStatus() {
      let result = null;
      const indexPayment = this.paymentType.findIndex(pay => pay.id === this.order.user_payment);
      if (indexPayment !== -1) {
          result = this.paymentType[indexPayment];
      }
      return result;
    },
    orderStatus() {
      let result = null;
      const indexStatus = this.statuses.findIndex(st => st.id === this.order.status);
      if (indexStatus !== -1) {
          result = this.statuses[indexStatus];
      }
      return result;
    },
    totalSum() {
      let result = 0;
      const products = this.order.products;
      if (products) {
        products.forEach(product => {
          result += Number(product.amount) * Number(product.sale_price ? product.sale_price : product.price);
        })
      }
      return result.toLocaleString('ru') + ' ₽';
    },
    labelCount() {
      return choseWordForm(this.productCount, 'товар', 'товара', 'товаров');
    }
  },
  methods: {
    toggleProducts(e) {
      const parent = e.target.parentElement;
      if (parent) {
        parent.classList.toggle("account__table-row_active")
      }
    },
    productPrice(price) {
      return price.toLocaleString('ru') + ' ₽';
    },
    repeatOrder() {
      this.message = "";
      const products = this.order.products;
      const order = products.filter(product => product.id).map(product => {
        return {
          id: product.id,
          amount: product.amount,
          optionId: product.optionId ? product.optionId : null
        }
      })
      if (order.length < 1) {
        this.message = "Не удалось повторить заказ!";
        return;
      }
      this.$emit("repeatOrder", order);
    }
  }
}
</script>
