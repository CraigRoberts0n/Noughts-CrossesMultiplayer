import React, { useState, useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';
import Square from './Square';
import { useLocation, Link } from 'react-router-dom'

const Board = ({ socket }) => {
  const location = useLocation();
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [turnPlayed, setTurnPlayed] = useState(false);
  const [opponent, setOpponent] = useState({id: '', name: '', identifier: ''});
  const [errorMessage, setErrorMessage] = useState('');

  const [isConnected, setIsConnected] = useState(false); //////////////////

  const [gameStatus, setGameStatus] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [oppDisconnected, setOppDisconnected] = useState(false);

  const [endState, setEndState] = useState({variant : '', endGameMessage: ''});

  useEffect(() => {
    //Get user Name, Room ID, and whether they Created or Joined Room 
    const { name, room, method } = location.state

    //Set user name to state
    setName(name);

    //If user created the Game set dependant states
    if(method === 'CREATE') {
      setRoom(room);
      setTurnPlayed(false)
      setIsConnected(true)
      setIdentifier('❌')
    } else {
      setRoom(room);
      setTurnPlayed(true);
      setIsConnected(true)
      setIdentifier('⭕')
      socket.emit('getOppDetails', { room }) //Asks server to supply both users with opponent details
    }

    return () => {
      setIsConnected(false)  
      
      //On user exit of game, remove Room from server 
      socket.emit('removeRoom', { room })
      socket.emit('disconnect', { room })  
    }

  }, [location, socket]);


  useEffect(() => {
    //Listens for server emit
    socket.on('oppDetails', ( [ {id: oppID1 , name: oppName1}, {id: oppID2 , name: oppName2} ]) => {
      setErrorMessage('')

      //Sets the state of the oppenents ID, Name, and Identifier  
      oppID1 !== socket.id 
        ? setOpponent({ id: oppID1, name: oppName1, identifier: '❌' }) 
        : setOpponent({ id: oppID2, name: oppName2, identifier: '⭕' })
    })
  }, [socket])


  useEffect(() => {
    socket.on('userDisconnect', () => {
      if (isConnected) {
        setErrorMessage('Opponent Disconnected - Please Go Back to Home')
        setOppDisconnected(true)
      }
    })
  }, [socket, isConnected]);


  useEffect(() => {
    //Listens for server emit
    //Updates the Game grid with the new grid data supplied by the opponent
    socket.on('updateSquares', ({ squares, xIsNext }) => {
      setErrorMessage('')
      setSquares(squares);
      setTurnPlayed(false)
      setXIsNext(!xIsNext)
    })
  }, [turnPlayed, socket])


  const handleClick = (i) => {
    //When the user clicks on a Game Square
    const updateSquares = squares.slice();

    //Checks whether the Square clicked was a valid move dependant on Game state and Position
    if (calculateWinner(updateSquares) || updateSquares[i] || turnPlayed || !opponent.name || isFinished || oppDisconnected){
      //If invalid click, supplies the correct Error Message
      if (updateSquares[i]) setErrorMessage('Selected different Square');
      if (turnPlayed) setErrorMessage('Please Wait for Opponent to Play Turn');
      if (!opponent.name) setErrorMessage('Please Wait for an Opponent to Join');
      if (isFinished) setErrorMessage('Game is Finished, Go back to Homepage');
      if (oppDisconnected) setErrorMessage('Opponent Disconnected - Please Go Back to Home')
      return;
    }

    //Updates Game Grid with User Clicked Square
    updateSquares[i] = xIsNext ? '❌' : '⭕';

    //Updates State for Error Message, Game Grid, and Current X or O
    setErrorMessage('');
    setSquares(updateSquares);
    setXIsNext(!xIsNext);

    //Set played equal true, then emit updated Game Grid to server for opponent 
    setTurnPlayed(true);
    socket.emit('turnPlayed', { name, room, updateSquares, xIsNext });
  }

  //Renders Game Square onto the display with onClick handler and unique identifier
  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  }

  //Calculate if user has winning State
  const calculateWinner = (squares) => {
    //Logic to check if Game grid is on Winning State
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { 'winningIdentifier' : squares[a] }
      }
    }

    //If all grid squares are not null, meaning game equals a tie
    if (squares.reduce((n,x) => n + (x !== null), 0) === 9) {
      return { 'winningIdentifier' : 'tie' }
    }

    return null;
  }

  useEffect(() => {
    //Check if State is Winning State
    const winner = calculateWinner(squares);

    //If winning state
    if (winner){
      //Set game state to isFinished
      setIsFinished(true);

      //If game is a tie, show Game Message
      if (winner.winningIdentifier === 'tie') {
        setEndState({ variant: 'warning', endGameMessage: 'Game is a Tie!' })
      } else {
        //If a user won, show Game Message with correct Message and Styling 
        winner.winningIdentifier === identifier 
        ? setEndState({ variant: 'success', endGameMessage: 'Winner Winner!' })
        : setEndState({ variant: 'danger', endGameMessage: 'Hard Luck!' })
      }
      
    } else {
      //Update next user Identfier 
      setGameStatus(`Next player: ${xIsNext ? '❌' : '⭕'}`)
    }
  },[squares, xIsNext, identifier])

  return (
    <div>
      {/* Error Message Bootstrap Alert Message */}
      {errorMessage && (
          <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible>
              <Alert.Heading>{ errorMessage }</Alert.Heading>
          </Alert>
      )}

      {/* Game Finished Alert Message, dependent on Game Winner or Tie */}
      { isFinished ? (
        <Alert variant={endState.variant}>
          <Alert.Heading>{ endState.endGameMessage } <Alert.Link><Link to="/"> Go Back to Home </Link></Alert.Link></Alert.Heading>
        </Alert>
      ) : null }

      {/* If no opponent has joined, display Alert */}
      { opponent.name ? (
        null
      ) : <Alert variant="info">
            <Alert.Heading>Please Wait for an Opponent to Join</Alert.Heading>
          </Alert> }


      {/* Display game Info */}
      <Container className="gameInfoContainer">
        <div>Room Identifier: <b>{ room }</b></div>

        <div><p>Your Username: <b>{ name }</b> | Your Identifier { identifier } </p></div>

        <div className="opp">{opponent.name ? `Playing against ${opponent.name}` : null }</div>
        
        <div className="status">{gameStatus}</div>
      </Container>

      {/* Show Game Grid */}
      <Container className="gameBoard">
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </Container>    
    </div>
  );
}

export default Board;