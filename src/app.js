const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars").create({
  defaultLayout: "main",
  extname: ".hbs",
});
const morgan = require("morgan");
const ChatList = require("./ChatList");
const Chat = require("./Chat");

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine);
app.set("view engine", ".hbs");

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(require("./routes/index"));

// Static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Additional route to render the index view
app.get("/", async (req, res) => {
  try {
    const chatList = new ChatList();
    await chatList.loadChats();

    res.render("index", {
      chats: chatList.getChats(),
      loading: chatList.isLoading(),
      error: chatList.hasError(),
      errorMessage: chatList.getErrorMessage(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to retrieve chat data
app.get("/chat/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = new Chat(chatId);
    await chat.loadMessages();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, error: "Failed to load chat data" });
  }
});

module.exports = app;