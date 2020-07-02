import React from 'react'
import {Navbar, Nav} from 'react-bootstrap';
import { Link } from 'react-router-dom'

const SiteNavbar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Link to="/"><Navbar.Brand>Noughts & Crosses - <span role="img" aria-label="emoji">❌ ⭕</span></Navbar.Brand></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Link to="about"><Navbar.Text>About</Navbar.Text></Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default SiteNavbar;