
export class Promocode {
  constructor(nameStorage) {
    this.$nameStorage = nameStorage;
  }

  addToStorage(data) {
    localStorage.setItem(this.$nameStorage, JSON.stringify(data));
  }

  getFromStorage() {
    if (this.isHasStorage()) {
      return JSON.parse(localStorage.getItem(this.$nameStorage)).id;
    }
  }

  removeFromStorage() {
    if (this.isHasStorage()) {
      localStorage.removeItem(this.$nameStorage);
    }
  }

  isHasStorage() {
    return localStorage.getItem(this.$nameStorage);
  }

}