import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const Join = ({ name, setName, room, setRoom, socket, setErrorMessage}) => {
    const [joinStatus, setJoinStatus] = useState(false);

    //onClick Handler
    const onClick = (e) => {
        //Prevent page refresh
        e.preventDefault()

        //Check if inputs are empty
        if (!name || !room) {
            setErrorMessage('Enter all Fields')
        } else {
            //Emit to server to Join and existing game
            socket.emit('join', { name, room }, ({error}) => {
                error 
                ? setErrorMessage(error)
                : setJoinStatus(true)
            })
        }
    }

    //If true, Redirect to the Board Route passing state Data
    if(joinStatus) {
        return <Redirect to={{
            pathname: '/board',
            state: { name, room, method: 'JOIN' }
        }} />
    }

    return (
        <Container>
            <Form onSubmit={onClick}>
            <Form.Group>
                <Form.Label>Join</Form.Label>
                <Form.Control type="text" placeholder="Enter Name" name={name} value={name} onChange={(e) => setName(e.target.value)} />
                <Form.Control type="text" placeholder="Enter Room ID" name={room} value={room} onChange={(e) => setRoom(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Join Game
            </Button>

            </Form>
        </Container>
    )
}

export default Join