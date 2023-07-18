const { collection, query, onSnapshot } = require("firebase-admin/firestore");
const { db } = require("../firebase");

class ChatList {
  constructor() {
    this.chats = [];
    this.currentChatId = null;
    this.loading = true;
    this.error = null;
  }

  async loadChats() {
    try {
      const q = query(collection(db, "chats", "colec", "chats"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        this.chats = [];
        snapshot.forEach((doc) => {
          this.chats.push({ id: doc.id, name: doc.data().name });
        });
        this.loading = false;
      });
    } catch (error) {
      this.error = error;
      console.error(error);
    }
  }

  getChats() {
    return this.chats;
  }

  getCurrentChatId() {
    return this.currentChatId;
  }

  setCurrentChatId(chatId) {
    this.currentChatId = chatId;
  }

  isLoading() {
    return this.loading;
  }

  hasError() {
    return this.error !== null;
  }

  getErrorMessage() {
    return this.error ? this.error.message : "";
  }

  onChatItemClick(chatId) {
    this.currentChatId = chatId;
  }
}

module.exports = ChatList;
