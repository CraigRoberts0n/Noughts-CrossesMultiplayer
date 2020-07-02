const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const path = require('path');

const { addUser, removeUser, getUsersInRoom, getCurrentRooms, users } = require('./users');

const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)

app.use(cors());

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let rooms = 0;

io.on('connection', (socket) => {   

    socket.on('create', ({ name }, callback) => {
        socket.join('room-' + ++rooms); //join a room
        // console.log(`Connected: ${name}, room-${rooms} Socket: ${socket.id}`);
        addUser({ id: socket.id, name, room: `room-${rooms}` });

        io.emit('updateActiveRooms', getCurrentRooms())

        callback({name, room: `room-${rooms}`, socketID: socket.id})
    })

    socket.on('join', ({ name, room }, callback) => {
        let socketRoom = io.nsps['/'].adapter.rooms[room];
 
        if(socketRoom && socketRoom.length == 1){
            // console.log(`Connected: ${name}, ${room} Socket: ${socket.id}`);
            socket.join(room);
            addUser({ id: socket.id, name, room });
            io.emit('updateActiveRooms', getCurrentRooms())

            callback({name, room: `room-${rooms}`, socketID: socket.id, roomStatus: socketRoom})
        } else {
            callback({ error: 'Sorry, The room is either full or doesnt exist!' });
        }
    });

    socket.on('turnPlayed', ({ name, room, updateSquares, xIsNext }) => {
        socket.broadcast.to(room).emit('updateSquares', { name, squares: updateSquares, xIsNext })
    })

    socket.on('getActiveRooms', (callback) => {
        callback(getCurrentRooms())
    })

    socket.on('getOppDetails',({ room }) => {
        io.to(room).emit('oppDetails', getUsersInRoom(room))
    })

    socket.on('removeRoom', ({ room }) => {
        const user = removeUser(socket.id)
        io.to(room).emit('userDisconnect')
        io.emit('updateActiveRooms', getCurrentRooms())
    })

    socket.on('disconnect', ({ room }) => {
        const user = removeUser(socket.id)
        io.to(room).emit('userDisconnect')
        io.emit('updateActiveRooms', getCurrentRooms())
    })

});


server.listen(port, () => console.log(`server started on port ${port}`));