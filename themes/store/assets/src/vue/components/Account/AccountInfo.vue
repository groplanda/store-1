<template>
  <div class="account__info">
    <div class="account__info-item">
      <div class="account__info-label">ФИО</div>
      <div class="account__info-value">{{ fullName }}</div>
    </div>
    <div class="account__info-item">
      <div class="account__info-label">Номер телефона</div>
      <div class="account__info-value">{{ fullPhone }}</div>
    </div>
    <div class="account__info-item">
      <div class="account__info-label">Еmail</div>
      <div class="account__info-value">{{ user.email }}</div>
    </div>
    <div class="account__info-item">
      <div class="account__info-label">Адрес доставки</div>
      <div class="account__info-value">{{ fullAddress }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AccountInfo",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    fullPhone() {
      const phone = this.user.phone ? this.user.phone : 'Не указан';
      return phone;
    },
    fullName() {
      const surname = this.user.surname ? this.user.surname : '';
      return this.user.name + ' ' + surname;
    },
    fullAddress() {
      const entrance = this.user.entrance ? ' подъезд ' + this.user.entrance : '',
            flat = this.user.flat ? ' кв ' + this.user.flat : '',
            address = this.user.address ? this.user.address : 'Не указан';
      return address + entrance + flat;
    }
  }
}
</script>
