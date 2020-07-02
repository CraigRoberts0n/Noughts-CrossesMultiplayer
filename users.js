const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim();
    room = room.trim();
    const user = { id, name, room };
    users.push(user)
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

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

module.exports = { addUser, getUsersInRoom, removeUser, getCurrentRooms, users }