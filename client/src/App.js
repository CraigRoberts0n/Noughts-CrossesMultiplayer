import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import io from 'socket.io-client';

//Import CSS
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

//Import Components
import Board from './components/Gamegrid/Board';
import Home from './components/Landing/Home';
import SiteNavbar from './components/Reusable/SiteNavbar';
import Footer from './components/Reusable/Footer';

let socket;

//Endpoints for local dev 
const ENDPOINT = 'localhost:5000';

//Connect to Socket.io Server
if (process.env.NODE_ENV === 'production') {
  socket = io.connect(`${window.location.hostname}:${window.location.port}`);
} else {
  socket = io(`${window.location.hostname}:${window.location.port}`);
}

const App = () => {
  return (
    <>
    <Router>
      <SiteNavbar />
        <Route path="/" exact component={() => <Home socket={socket} />} />
        <Route path="/board" component={() => <Board socket={socket} />} />
      <Footer />
    </Router>
    </>
  );
}

export default App;
