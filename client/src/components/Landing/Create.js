import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { Container, Form, Button } from 'react-bootstrap';

const Create = ({ name, setName, room, setRoom, socket, setErrorMessage }) => {
    const [createStatus, setCreateStatus] = useState(false);

    const onClick = (e) => {
        e.preventDefault()
        if (!name) {
            setErrorMessage('Enter all Fields')
        } else {
            socket.emit('create', { name }, ({ error, room }) => {
                if (error) {
                    setErrorMessage(error)
                } else {
                    // socket.emit('updateRooms')
                    setRoom(room);
                    setCreateStatus(true)
                }
              });
        }
    }

    if(createStatus) {
        return <Redirect to={{
            pathname: '/board',
            state: { name, room, method: 'CREATE' }
        }} />
    }

    return (
        <Container>
            <Form onSubmit={onClick}>
                <Form.Group>
                    <Form.Label>Create</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" name={name} value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Create Game
                </Button>
            </Form>
        </Container>
    )
}

export default Create;