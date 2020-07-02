import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const Join = ({ name, setName, room, setRoom, socket, setErrorMessage}) => {
    const [joinStatus, setJoinStatus] = useState(false);

    const onClick = (e) => {
        e.preventDefault()
        if (!name || !room) {
            setErrorMessage('Enter all Fields')
        } else {
            socket.emit('join', { name, room }, ({error}) => {
                error 
                ? setErrorMessage(error)
                : setJoinStatus(true)
            })
        }
    }

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