<template>
  <div class="account__order-list">
    <AccountSingleOrder v-for="(order, index) in orders" :key="index" :order="order" @repeatOrder="repeatOrder" />
  </div>
</template>
<script>
import AccountSingleOrder from "./AccountSingleOrder";
import { Cart } from '@/src/plugins/Cart';
export default {
  name: "AccountOrders",
  components: {
    AccountSingleOrder
  },
  props: {
    orders: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    repeatOrder(order) {
      const cart = new Cart(".js-cart", ".js-cart-count");
      cart.clearStorage();
      cart.fillStorage(order);
      this.createRedirect();
    },
    createRedirect() {
      const url = new URL(process.env.MIX_URL + "/checkout");
      window.location.href = url;
    }
  }
}
</script>
