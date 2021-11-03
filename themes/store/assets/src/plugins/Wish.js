import axios from 'axios';

export class Wish {

  toggeWish(wishData) {
    axios.post("/api/user/wish", wishData)
    .then(response => {
      const data = response.data;
      this.alertWish(data.message);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      this.getWishCount(wishData.user_id);
    })
  }

  alertWish(message) {
    const alert = document.createElement("div");
    alert.classList.add("alert", "alert_add");
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, 1500)
  }

  getWishCount(id) {
    axios.get("/api/user/wish-count/" + id)
    .then(response => {
      const data = response.data;
      this.displayWishCount(data ? data : 0);

    })
    .catch(function (error) {
      console.log(error);
    })
  }

  displayWishCount(count) {
    document.querySelector(".js-wish-count").textContent = count
  }

}