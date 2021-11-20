<template>
  <section class="account section">
    <Loading  v-if="!userData" />
    <div class="wrap account__wrap" v-else>
      <div class="account__tab_default" v-if="activeTab === 0">
        <div class="account__heading account__heading_home">
          <h1 class="title account__title">Личный кабинет</h1>
          <button class="account__heading-logout" type="button" @click="onLogout" title="Выйти">
            <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.00201 18H16.002C17.105 18 18.002 17.103 18.002 16V2C18.002 0.897 17.105 0 16.002 0H2.00201C0.899014 0 0.00201416 0.897 0.00201416 2V8.001H7.00001V4L13 9L7.00001 14V10.001H0.00201416V16C0.00201416 17.103 0.899014 18 2.00201 18Z" fill="white"/>
            </svg>
          </button>
        </div>

        <AccountInfo :user="userData" />

        <div class="account__button-list">
          <button type="button" class="account__button" @click="activeTab = 1">Изменить пароль</button>
          <button type="button" class="account__button" @click="activeTab = 2">Изменить данные</button>
          <button type="button" class="account__button" @click="activeTab = 3">Избранное</button>
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

      <div class="account__tab" v-if="activeTab === 3">
        <AccountBack title="Избранное" @back="activeTab = 0" />
        <Wish :userId="userData.id" />
      </div>

    </div>
  </section>
</template>
<script>
import axios from "axios";
import AccountInfo from "./components/Account/AccountInfo";
import AccountOrders from "./components/Account/AccountOrders";
import AccountEdit from "./components/Account/AccountEdit";
import AccountChangePassword from "./components/Account/AccountChangePassword";
import Loading from "./components/Loading/Loading";
import Wish from "./components/Wish/Wish";
import AccountBack from "./components/Account/AccountBack";

export default {
  name: "Account",
  components: {
    AccountOrders,
    AccountEdit,
    Loading,
    AccountChangePassword,
    Wish,
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
  computed: {

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
