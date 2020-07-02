import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import io from 'socket.io-client';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import Board from './components/Gamegrid/Board';
import Home from './components/Landing/Home';
import SiteNavbar from './components/Reusable/SiteNavbar';
import Footer from './components/Reusable/Footer';

let socket;

const App = () => {
  const ENDPOINT = '192.168.1.193:5000' || 'localhost:5000' || process.env.URL;
  // socket = io(ENDPOINT);
  socket = io.connect(window.location.hostname);

  return (
    <React.Fragment>
    <Router>
      <SiteNavbar />
        <Route path="/" exact component={() => <Home socket={socket} ENDPOINT={ENDPOINT} />} />
        <Route path="/board" component={() => <Board socket={socket} ENDPOINT={ENDPOINT} />} />
      <Footer />
    </Router>
    </React.Fragment>
);
}

export default App;
