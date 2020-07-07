const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const path = require('path');

const { addUser, removeRoom, getUsersInRoom, getCurrentRooms, users } = require('./users');

const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)

app.use(cors());

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
    res.redirect('/')
});

let rooms = 0;

io.on('connection', (socket) => {   

    //Handle Creating a New Game Room
    socket.on('create', ({ name }, callback) => {
        socket.join('room-' + ++rooms); //join a room
        addUser({ id: socket.id, name, room: `room-${rooms}` }); //Add user to global users array

        io.emit('updateActiveRooms', getCurrentRooms()) //Update the Active Rooms so opponent can join

        callback({name, room: `room-${rooms}`, socketID: socket.id})
    })

    //Handle Joining an existing Room
    socket.on('join', ({ name, room }, callback) => {
        let socketRoom = io.nsps['/'].adapter.rooms[room];
 
        //check if room has 1 user
        if(socketRoom && socketRoom.length == 1){
            socket.join(room); //join room
            addUser({ id: socket.id, name, room }); //Add user to global users array
            io.emit('updateActiveRooms', getCurrentRooms()) //Update the Active Rooms 

            callback({name, room: `room-${rooms}`, socketID: socket.id, roomStatus: socketRoom})
        } else {
            callback({ error: 'Sorry, The room is either full or doesnt exist!' });
        }
    });

    //Middle function for transfering game State between opponents  
    socket.on('turnPlayed', ({ name, room, updateSquares, xIsNext }) => {
        socket.broadcast.to(room).emit('updateSquares', { name, squares: updateSquares, xIsNext })
    })

    //Returns all active rooms to Home
    socket.on('getActiveRooms', (callback) => {
        callback(getCurrentRooms())
    })

    //Get the opponent details
    socket.on('getOppDetails',({ room }) => {
        io.to(room).emit('oppDetails', getUsersInRoom(room))
    })

    //Remove room from server array
    socket.on('removeRoom', ({ room }) => {
        removeRoom(room)
        io.to(room).emit('userDisconnect')
        io.emit('updateActiveRooms', getCurrentRooms()) //Update the Active Rooms
    })

    //Remove room from server array
    socket.on('disconnect', ({ room }) => {
        removeRoom(room)
        io.to(room).emit('userDisconnect')
        io.emit('updateActiveRooms', getCurrentRooms()) //Update the Active Rooms
    })

});


server.listen(port, () => console.log(`server started on port ${port}`));