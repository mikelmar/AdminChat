const { db } = require("../firebase");

const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const querySnapshot = await db
      .collection("chats")
      .doc("colec")
      .collection("chats")
      .get();
    const chats = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.render("index", { chats });
  } catch (error) {
    console.error(error);
  }
});

/*router.get("/chat/:id", async (req, res) => {
  try {
    const chatId = req.params.id;

    // Obtener los mensajes del chat desde la colección correspondiente
    const snapshot = await db.collection(chatId).orderBy("timestamp").get();
    const messages = snapshot.docs.map((doc) => doc.data());

    res.render("chat", { messages });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});*/

router.get("/chat/:id", async (req, res) => {
  try {
    const chatId = req.params.id;

    // Obtener el nombre de la colección utilizando el chatId
    const snapshot = await db
      .collection("chats")
      .doc("colec")
      .collection("chats")
      .doc(chatId)
      .get();

    // Verificar si el documento existe utilizando la propiedad `data()`
    if (snapshot.data()) {
      const chatData = snapshot.data();
      const chatName = chatData.name;

      // Obtener los mensajes del chat desde la colección correspondiente
      const messagesSnapshot = await db
        .collection(chatName)
        .orderBy("timestamp")
        .get();

      const messages = messagesSnapshot.docs.map((doc) => doc.data());

      res.render("chat", { messages });
    } else {
      res.status(404).send("Chat not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




module.exports = router;