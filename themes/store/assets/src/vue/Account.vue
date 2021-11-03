<template>
  <section class="page section">
    <Loading  v-if="!userData" />
    <div class="wrap page__wrap" v-else>
      <h1 class="title page__title">Добро пожаловать, {{ userData.name }}</h1>
      <div class="page__row">
        <aside class="page__aside page__aside_account">
          <div class="page__menu">
            <span class="page__menu-link" :class="{ 'page__menu-link_active': activeTab === 0 }" @click="activeTab = 0">Мои заказы</span>
            <span class="page__menu-link" :class="{ 'page__menu-link_active': activeTab === 1 }" @click="activeTab = 1">Изменить личные данные</span>
            <span class="page__menu-link" :class="{ 'page__menu-link_active': activeTab === 2 }" @click="activeTab = 2">Изменить пароль</span>
            <span class="page__menu-link" :class="{ 'page__menu-link_active': activeTab === 3 }" @click="activeTab = 3">Избранное</span>
            <span class="page__menu-link" @click="onLogout">Выйти</span>
          </div>
        </aside>
        <div class="page__content page__content_account">
          <div class="page__entry">
            <div class="account">

              <div class="account__orders" v-if="activeTab === 0">
                <AccountOrders :orders="orders" v-if="orders.length" />
                <div class="title title_sm account__title" v-else>Заказов пока нет...</div>
              </div>
              <div class="account__form" v-if="activeTab === 1">
                <AccountEdit :user="userData" />
              </div>
              <div class="account__form" v-if="activeTab === 2">
                <AccountChangePassword :user="userData" />
              </div>
              <div class="account__form" v-if="activeTab === 3">
                <Wish :userId="userData.id" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import AccountOrders from "./components/Account/AccountOrders";
import AccountEdit from "./components/Account/AccountEdit";
import AccountChangePassword from "./components/Account/AccountChangePassword";
import Loading from "./components/Loading/Loading";
import Wish from "./components/Wish/Wish";

export default {
  name: "Account",
  components: {
    AccountOrders,
    AccountEdit,
    Loading,
    AccountChangePassword,
    Wish
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
    }
  },
  created() {
    this.getUserdata();
    this.fetchUserOrders();
  },
}
</script>
