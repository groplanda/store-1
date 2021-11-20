<template>
  <div class="account__order">
    <div class="account__order-title">Заказ за {{ orderDate.name }}</div>
    <div class="account__order-total" v-if="infoCollapse">
      <div class="account__order-value">Сумма заказа</div>
      <div class="account__order-value">{{ totalSum }}</div>
    </div>
    <div class="account__order-body" v-else>

      <div class="account__order-products">

        <div class="account__order-product" v-for="(product, index) in order.products" :key="index">
          <a :href="'/product/' + product.id" class="account__order-product-name">
            {{ product.title }} x {{ product.amount }}
          </a>
          <div class="account__order-product-price">
            {{ product.sale_price ? productPrice(product.sale_price) : productPrice(product.price) }}
          </div>
        </div>

        <button type="button" class="button button_primary account__order-repeat" @click="repeatOrder">Повторить заказ</button>
        <div class="account__order-error" v-if="message">{{ message }}</div>

      </div>

      <div class="account__order-total account__order-total_bordered">
        <div class="account__order-value">Сумма заказа</div>
        <div class="account__order-value">{{ totalSum }}</div>
      </div>

      <div class="account__order-item" v-if="order.user_delivery === 0">
        <div class="account__order-value account__order-value_col">Адрес доставки</div>
        <div class="account__order-text">{{ order.user_address }}</div>
      </div>
      <div class="account__order-item" v-else>
        <div class="account__order-value account__order-value_col">Тип доставки</div>
        <div class="account__order-text">Самовывоз</div>
      </div>

      <div class="account__order-item" v-if="paymentStatus">
        <div class="account__order-value account__order-value_col">Способ оплаты</div>
        <div class="account__order-text">{{ paymentStatus.title }}</div>
      </div>

      <div class="account__order-item" v-if="orderStatus">
        <div class="account__order-value account__order-value_col">Статус заказа</div>
        <div class="account__order-text" :class="'account__order-text_' + orderStatus.id ">{{ orderStatus.title }}</div>
      </div>

      <div class="account__order-item">
        <div class="account__order-text"><strong>Время заказа</strong> - {{ orderDate.time }}</div>
      </div>

    </div>
    <button type="button" class="account__button account__button_order button" @click="infoCollapse = !infoCollapse">
      {{ infoCollapse ? 'Подробнее' : 'Скрыть' }}
    </button>
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
      message: "",
      infoCollapse: true
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
    },
    orderDate() {
      const date = new Date(this.order.created_at);
      return {
        time: date.getHours() + ':' + date.getMinutes(),
        name: date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear(),
      }
    }
  },
  methods: {
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
