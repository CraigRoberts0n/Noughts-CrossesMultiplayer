import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';


const ActiveRooms = ({ socket, ENDPOINT, users, setUsers }) => {

    useEffect(() => {
        socket.emit('getActiveRooms', (callback) => {
            setUsers(callback)
        })

        socket.on('updateActiveRooms', (callback) => {
            setUsers(callback)
        })

        return () => {
            socket.off();
          }
    }, [socket, ENDPOINT, setUsers])

    return (
        <Container>
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