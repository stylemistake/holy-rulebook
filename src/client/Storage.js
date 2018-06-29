const DB_NAME = 'holy-rulebook-storage';
const DB_STORE_NAME = 'persistence';

export default class Storage {

  constructor() {
    this.db = null;
    this.ready = new Promise((resolve, reject) => {
      var request = global.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = e => {
        this.db = e.target.result;
        this.db.createObjectStore(DB_STORE_NAME);
      };
      request.onsuccess = e => {
        this.db = e.target.result;
        resolve();
      };
      request.onerror = e => {
        this.db = e.target.result;
        reject(e);
      };
    });
  }

  getStore() {
    return this.db
      .transaction([DB_STORE_NAME], 'readwrite')
      .objectStore(DB_STORE_NAME);
  }

  get(key) {
    return this.ready.then(() => {
      return new Promise((resolve, reject) => {
        var request = this.getStore().get(key);
        request.onsuccess = e => resolve(e.target.result);
        request.onerror = reject;
      });
    });
  }

  set(key, value) {
    return this.ready.then(() => {
      return new Promise((resolve, reject) => {
        var request = this.getStore().put(value, key);
        request.onsuccess = resolve;
        request.onerror = reject;
      });
    });
  }

  purge() {
    global.indexedDB.deleteDatabase(DB_NAME);
  }

}
