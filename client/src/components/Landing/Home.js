import React, { useState } from 'react';
import { Alert, Container, Row, Col } from 'react-bootstrap';

import Create from './Create';
import Join from './Join';
import ActiveRooms from './ActiveRooms';

const Home = ({ socket, ENDPOINT }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState([]);

    return (
        <React.Fragment>
            {errorMessage ? (
                <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible>
                    <Alert.Heading>{ errorMessage }</Alert.Heading>
                </Alert>
            ) : null }

            <Container className="mainHomeContainer">
                <Row>
                    <Col>
                        <div className="Create">
                            <Create socket={socket} name={name} setName={setName} room={room} setRoom={setRoom} setErrorMessage={setErrorMessage} />
                        </div>
                        <div className="Join">
                            <Join socket={socket} name={name} setName={setName} room={room} setRoom={setRoom} setErrorMessage={setErrorMessage} />
                        </div>
                    </Col>
                    <Col xs={4}>
                        <div className="ActiveRooms">
                            <ActiveRooms socket={socket} ENDPOINT={ENDPOINT} users={users} setUsers={setUsers}/>
                        </div>
                    </Col>
                </Row>
            </Container>
        </React.Fragment>
    )
}

export default Home;