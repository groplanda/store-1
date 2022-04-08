<template>
  <section class="account section">
    <Loading  v-if="!userData" />
    <div class="account__wrap wrap" v-else>
      <div class="account__tab_default" v-if="activeTab === 0">
        <div class="account__heading account__heading_home">
          <h1 class="title account__title">Личный кабинет</h1>
          <button class="account__heading-logout" type="button" @click="onLogout" title="Выйти">
            <svg class="account__heading-exit">
              <use :xlink:href="$sprite_path + '#sprite-exit'"></use>
            </svg>
          </button>
        </div>
        <AccountInfo :user="userData" />
        <div class="account__button-list">
          <button type="button" class="account__button" @click="activeTab = 1">Изменить пароль</button>
          <button type="button" class="account__button" @click="activeTab = 2">Изменить данные</button>
        </div>
        <div class="account__orders">
          <div class="title account__title account__title_orders">История заказов</div>
          <AccountOrders :orders="orders" v-if="orders.length" />
          <div class="account__subtitle" v-else>Заказов пока нет...</div>
        </div>
      </div>
      <div class="account__tab_default" v-if="activeTab === 1">
        <AccountBack title="Изменить пароль" @back="activeTab = 0" />
        <AccountChangePassword :user="userData" />
      </div>
      <div class="account__tab_default" v-if="activeTab === 2">
        <AccountBack title="Изменить данные" @back="activeTab = 0" />
        <AccountEdit :user="userData" @updateUser="updateUser" />
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import AccountOrders from "./Account/AccountOrders";
import AccountEdit from "./Account/AccountEdit";
import AccountBack from "./Account/AccountBack";
import AccountInfo from "./Account/AccountInfo";
import AccountChangePassword from "./Account/AccountChangePassword";
import Loading from "./Loading/Loading";

export default {
  name: "Account",
  components: {
    AccountOrders,
    AccountEdit,
    Loading,
    AccountChangePassword,
    AccountInfo,
    AccountBack
  },
  data() {
    return {
      userData: null,
      activeTab: 0,
      orders: []
    }
  },
  methods: {
    getUserdata() {
      axios.get("/api/user/userdata")
      .then(response => {
        const data = response.data;
        if (response.status === 200 && data.status === "success") {
          this.userData = data.user;
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          this.redirectUser()
        }
        if (error.response.status === 500) {
          console.log('500');
        }
      })
    },
    onLogout() {
      axios.get("/api/user/logout")
      .then(response => {
        const data = response.data;
        if (response.status === 200 && data.status === "success") {
          this.redirectUser('logout')
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          console.log('403');
        }
        if (error.response.status === 500) {
          console.log('500');
        }
      })
    },
    redirectUser(addHash = false) {
      const url = new URL(process.env.MIX_URL);
      if (addHash) {
        url.hash = addHash;
      }
      window.location.href = url;
    },
    fetchUserOrders() {
      axios.get("/api/user/orders")
      .then(response => {
        const data = response.data;
        if (response.status === 200 && data.status === "success") {
          this.orders = data.message;
        }
      })
      .catch(error => {
        if (error.response.status === 403) {
          console.log('403');
        }
        if (error.response.status === 500) {
          console.log('500');
        }
      })
    },
    updateUser() {
      this.getUserdata();
    }
  },
  created() {
    this.getUserdata();
    this.fetchUserOrders();
  }
}
</script>
