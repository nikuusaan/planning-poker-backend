import axios from "axios";

const baseURL = "http://localhost:4000/room";

async function testApp() {
  // Test creating a new room
  const newRoom = {
    // Add room properties as needed
  };

  const { data: createRoomResponse } = await axios.post(baseURL, newRoom);
  console.log("Create Room Response:", createRoomResponse);

  const roomId = createRoomResponse.result.id;

  // Test getting room by ID
  const { data: getRoomResponse } = await axios.get(`${baseURL}/${roomId}`);
  console.log("Get Room Response:", getRoomResponse);

  // Test updating a user in a room
  const userId = "sampleUserId";
  const userUpdate = {
    name: "New User Name",
  };

  const { data: updateUserResponse } = await axios.patch(
    `${baseURL}/${roomId}/user/${userId}`,
    userUpdate
  );
  console.log("Update User Response:", updateUserResponse);

  // Test deleting a user in a room
  const { data: deleteUserResponse } = await axios.delete(
    `${baseURL}/${roomId}/user/${userId}`
  );
  console.log("Delete User Response:", deleteUserResponse);

  // Test updating a story in a room
  const storyId = "sampleStoryId";
  const storyUpdate = {
    title: "New Story Title",
  };

  const { data: updateStoryResponse } = await axios.patch(
    `${baseURL}/${roomId}/story/${storyId}`,
    storyUpdate
  );
  console.log("Update Story Response:", updateStoryResponse);

  // Test deleting a story in a room
  const { data: deleteStoryResponse } = await axios.delete(
    `${baseURL}/${roomId}/story/${storyId}`
  );
  console.log("Delete Story Response:", deleteStoryResponse);
}

testApp();
