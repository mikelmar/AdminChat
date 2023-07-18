const { collection, query, onSnapshot, orderBy } = require("firebase-admin/firestore");
const { db } = require("../firebase");
const Message = require("./Message");

class Chat {
  constructor(chatId) {
    this.chatId = chatId;
    this.messages = [];
    this.loading = true;
    this.error = null;
    this.unsubscribe = null;
  }

  async loadMessages() {
    try {
      const q = query(
        collection(db, this.chatId),
        orderBy('timestamp')
      );
      this.unsubscribe = onSnapshot(q, (snapshot) => {
        this.messages = [];
        snapshot.forEach((doc) => {
          const messageData = doc.data();
          const message = new Message(
            messageData.name,
            messageData.text,
            messageData.timestamp,
            messageData.uid,
            messageData.url
          );
          this.messages.push(message);
        });
        this.loading = false;
      });
    } catch (error) {
      this.error = error;
      console.error(error);
    }
  }

  getMessages() {
    return this.messages;
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

  unsubscribeFromMessages() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

module.exports = Chat;