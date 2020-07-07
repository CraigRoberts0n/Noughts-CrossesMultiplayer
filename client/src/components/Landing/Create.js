import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { Container, Form, Button } from 'react-bootstrap';

const Create = ({ name, setName, room, setRoom, socket, setErrorMessage }) => {
    const [createStatus, setCreateStatus] = useState(false);

    //onClick Handler
    const onClick = (e) => {
        //Prevent page refresh
        e.preventDefault()

        //Check if input is empty
        if (!name) {
            setErrorMessage('Enter all Fields')
        } else {
            //Emit to server to Create a new Game
            socket.emit('create', { name }, ({ error, room }) => {
                if (error) {
                    setErrorMessage(error)
                } else {
                    setRoom(room);
                    setCreateStatus(true)
                }
              });
        }
    }

    //If true, Redirect to the Board Route passing state Data
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