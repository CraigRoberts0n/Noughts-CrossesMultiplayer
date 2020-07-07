import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';


const ActiveRooms = ({ socket, users, setUsers }) => {

    useEffect(() => {
        // Gets Active Rooms on Load
        socket.emit('getActiveRooms', (callback) => {
            setUsers(callback)
        })

        //Listens for Active Rooms Changes and updates
        socket.on('updateActiveRooms', (callback) => {
            setUsers(callback)
        })

        return () => {
            socket.off();
          }
    }, [socket, setUsers])

    return (
        <Container>
            {/* Display all Active Rooms */}
            <u><p>Active Rooms</p></u>
            {users.length > 0 
            ? users.map(({room})=> (
                    <div key={room}>
                        {room}
                  </div>
                ))
            : <p>There are no active Rooms</p>
            }   
        </Container>
    )
}

export default ActiveRooms;