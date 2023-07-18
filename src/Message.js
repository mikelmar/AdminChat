class Message {
  constructor(name, text, timestamp, uid, url) {
    this.name = name;
    this.text = text;
    this.timestamp = timestamp;
    this.uid = uid;
    this.url = url;
  }

  hasURL() {
    return this.url && (this.url.startsWith('http://') || this.url.startsWith('https://'));
  }
}

module.exports = Message;