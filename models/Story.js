const admin = require("firebase-admin");
const firestore = admin.firestore();

const storyCollection = firestore.collection("stories");

module.exports = {
  storyCollection,
};
