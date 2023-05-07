const admin = require("firebase-admin");
const firestore = admin.firestore();

const userCollection = firestore.collection("users");

module.exports = {
  userCollection,
};
