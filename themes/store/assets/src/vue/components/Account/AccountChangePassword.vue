<template lang="">
  <form class="account__form" @submit.prevent="onChange">
    <div class="account__form-row account__form-row_last">
      <div class="account__form-group account__form-group_full">
        <label class="account__form-label">Текущий пароль</label>
        <input type="password" class="account__form-input" v-model="form.current_password" placeholder="**********" />
        <span class="account__form-error" v-if="currentPasswordErr">{{ currentPasswordErr }}</span>
      </div>
      <div class="account__form-group account__form-group_full">
        <label class="account__form-label">Новый пароль</label>
        <input type="password" class="account__form-input" v-model="form.password" placeholder="**********" />
        <span class="account__form-error" v-if="passwordErr">{{ passwordErr }}</span>
      </div>
      <div class="account__form-group account__form-group_full">
        <label class="account__form-label">Подтвердите пароль</label>
        <input type="password" class="account__form-input" v-model="form.password_confirmation" placeholder="**********" />
        <span class="account__form-error" v-if="passwordConfirmationErr">{{ passwordConfirmationErr }}</span>
      </div>
    </div>
    <button type="submit" class="button button_primary account__form-button">Изменить пароль</button>
    <input type="hidden" v-model="form.email" />
    <span class="account__form-response" v-if="submitStatus">{{ submitStatus }}</span>
  </form>
</template>
<script>
import axios from "axios";
import { onValidate, checkErr } from "@/src/helpers/validate.js";

export default {
  name: "AccountChangePassword",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        current_password: "",
        password: "",
        password_confirmation: "",
        email: this.user.email,
      },
      errors: [],
      submitStatus: null
    }
  },
  computed: {
    currentPasswordErr() {
    return checkErr('current_password', this.errors);
    },
    passwordErr() {
      return checkErr('password', this.errors);
    },
    passwordConfirmationErr() {
      return checkErr('password_confirmation', this.errors);
    }
  },
  methods: {
    onChange() {
      this.errors = [];
      this.submitStatus = null;
      axios.post('/api/user/change-password', this.form)
      .then(response => {
        const data = response.data;
        if (data.status === 'error') {
          this.onValidate(data);
          return;
        }
        if (data.status === 'success') {
          this.submitStatus = data.message;
          this.resetForm();
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
    onValidate(response) {
      this.errors = onValidate(response, this.form);
    },
    resetForm() {
      this.errors = [];
      Object.keys(this.form).forEach(key => this.form[key] = '');
    }
  }
}
</script>