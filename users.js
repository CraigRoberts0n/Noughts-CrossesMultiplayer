//Server users array
const users = [];

//Add user object to array
const addUser = ({ id, name, room }) => {
    name = name.trim();
    room = room.trim();
    const user = { id, name, room };
    users.push(user)
}

//Remove room objects from array
const removeRoom = (room) => {
    for(i = 0; i < 2; i++){
        let index = users.findIndex((user) => user.room === room);
        if(index !== -1) {
            users.splice(index, 1)[0];
        }
      }
}

//Return all users within a room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

//Return all active rooms that are joinable
const getCurrentRooms = () => {
    const currentRooms = users.map((active) => active.room);
    tempRoomOcc = []
    for (i = 0; i < currentRooms.length; i++) {
        const count = currentRooms.filter(x => x == currentRooms[i]).length;
        tempRoomOcc[i] = {room: currentRooms[i], count}
    }

    let activeRooms = tempRoomOcc.filter(room => room.count !== 2)

    return activeRooms;
}

module.exports = { addUser, removeRoom, getUsersInRoom, getCurrentRooms, users }