import React from 'react'
import {Navbar} from 'react-bootstrap';
import { Link } from 'react-router-dom'

const SiteNavbar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Link to="/"><Navbar.Brand>Noughts & Crosses - <span role="img" aria-label="emoji">❌ ⭕</span></Navbar.Brand></Link>
        </Navbar>
    )
}

export default SiteNavbar;