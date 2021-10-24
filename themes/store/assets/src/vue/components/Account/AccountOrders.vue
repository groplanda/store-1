<template>
  <div class="account__table">
    <div class="account__table-thead">
      <div class="account__table-col account__table-col_info">
        <span class="account__table-val">Дата заказа</span>
      </div>
      <div class="account__table-col">
        <span class="account__table-val">Кол-во товаров</span>
      </div>
      <div class="account__table-col">
        <span class="account__table-val">Оплата</span>
        </div>
      <div class="account__table-col account__table-col_total">
        <span class="account__table-val">Итого</span>
      </div>
    </div>
    <div class="account__table-tbody">
      <AccountSingleOrder v-for="(order, index) in orders" :key="index" :order="order" />
    </div>
  </div>
</template>
<script>
import AccountSingleOrder from "./AccountSingleOrder";

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
  }
}
</script>
