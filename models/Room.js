const admin = require("firebase-admin");
const firestore = admin.firestore();

const roomCollection = firestore.collection("rooms");

module.exports = {
  roomCollection,
};
