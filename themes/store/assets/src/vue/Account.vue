<template>
  <section class="account section">
    <Loading  v-if="!userData" />
    <div class="container container--main account__container" v-else>
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
import AccountOrders from "./components/Account/AccountOrders";
import AccountEdit from "./components/Account/AccountEdit";
import AccountBack from "./components/Account/AccountBack";
import AccountInfo from "./components/Account/AccountInfo";
import AccountChangePassword from "./components/Account/AccountChangePassword";
import Loading from "./components/Loading/Loading";

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
