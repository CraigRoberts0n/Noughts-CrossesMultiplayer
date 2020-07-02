import React, { useState, useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';
import Square from './Square';
import { useLocation, Link } from 'react-router-dom'
// import { useLocation, useHistory, Link } from 'react-router-dom'

const Board = ({ socket, ENDPOINT }) => {
  const location = useLocation();
  // const history = useHistory()
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [turnPlayed, setTurnPlayed] = useState(false);
  const [opponent, setOpponent] = useState({id: '', name: '', identifier: ''});
  const [errorMessage, setErrorMessage] = useState('');

  // const [socketID, setsocketID] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const [gameStatus, setGameStatus] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [oppDisconnected, setOppDisconnected] = useState(false);

  const [endState, setEndState] = useState({variant : '', endGameMessage: ''});

  useEffect(() => {
    const { name, room, method } = location.state

    setName(name);

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
      socket.emit('getOppDetails', { room }) 
    }

    return () => {
      setIsConnected(false)  
      socket.emit('removeRoom', { room })
      socket.emit('disconnect', { room })  
    }

  }, [ENDPOINT, location, socket]);

  // useEffect(() => {
  //   console.log(socket.id, ' # ', socketID) // 
  //   setsocketID(socket.id)
  // }, [setsocketID, socket, socketID]);

  // useEffect(() => {
  //   if (socketID === undefined) { //the refresh redirect to home
  //     history.push('/')
  //   }
  // }, [history, socketID]);


  useEffect(() => {
    socket.on('oppDetails', ( [ {id: oppID1 , name: oppName1}, {id: oppID2 , name: oppName2} ]) => {
      setErrorMessage('')
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
  }, [socket, isConnected, location]);


  useEffect(() => {
    socket.on('updateSquares', ({ squares, xIsNext }) => {
      setErrorMessage('')
      setSquares(squares);
      setTurnPlayed(false)
      setXIsNext(!xIsNext)
    })
  }, [turnPlayed, socket])


  const handleClick = (i) => {
    const updateSquares = squares.slice();
    if (calculateWinner(updateSquares) || updateSquares[i] || turnPlayed || !opponent.name || isFinished || oppDisconnected){
      if (updateSquares[i]) setErrorMessage('Selected different Square');
      if (turnPlayed) setErrorMessage('Please Wait for Opponent to Play Turn');
      if (!opponent.name) setErrorMessage('Please Wait for an Opponent to Join');
      if (isFinished) setErrorMessage('Game is Finished, Go back to Homepage');
      if (oppDisconnected) setErrorMessage('Opponent Disconnected - Please Go Back to Home')
      return;
    }

    updateSquares[i] = xIsNext ? '❌' : '⭕';

    setErrorMessage('');
    setSquares(updateSquares);
    setXIsNext(!xIsNext);

    setTurnPlayed(true);
    socket.emit('turnPlayed', { name, room, updateSquares, xIsNext });
  }

  const renderSquare = (i) => {
    return <Square value={squares[i]} onClick={() => handleClick(i)} />;
  }

  const calculateWinner = (squares) => {
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

    if (squares.reduce((n,x) => n + (x !== null), 0) === 9) {
      return { 'winningIdentifier' : 'tie' }
    }

    return null;
  }

  useEffect(() => {
    const winner = calculateWinner(squares);

    if (winner){
      // setGameStatus(`Winner: ${winner.winningIdentifier}`);
      setIsFinished(true);

      if (winner.winningIdentifier === 'tie') {
        setEndState({ variant: 'warning', endGameMessage: 'Game is a Tie!' })
      } else {
        winner.winningIdentifier === identifier 
        ? setEndState({ variant: 'success', endGameMessage: 'Winner Winner!' })
        : setEndState({ variant: 'danger', endGameMessage: 'Hard Luck!' })
      }
      
    } else {
      setGameStatus(`Next player: ${xIsNext ? '❌' : '⭕'}`)
    }
  },[squares, xIsNext, identifier])

  return (
    <div>
      {errorMessage && (
          <Alert variant='danger' onClose={() => setErrorMessage('')} dismissible>
              <Alert.Heading>{ errorMessage }</Alert.Heading>
          </Alert>
      )}


      { isFinished ? (
        <Alert variant={endState.variant}>
          <Alert.Heading>{ endState.endGameMessage } <Alert.Link><Link to="/"> Go Back to Home </Link></Alert.Link></Alert.Heading>
        </Alert>
      ) : null}

      { opponent.name ? (
        null
      ) : <Alert variant="info">
            <Alert.Heading>Please Wait for an Opponent to Join</Alert.Heading>
          </Alert> }


      <Container className="gameInfoContainer">
        <div>Room Identifier: <b>{ room }</b></div>

        <div><p>Your Username: <b>{ name }</b> | Your Identifier { identifier } </p></div>

        <div className="opp">{opponent.name ? `Playing against ${opponent.name}` : null }</div>
        
        <div className="status">{gameStatus}</div>
      </Container>

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