import React, { useState, useEffect } from 'react';
import Board from './Components/Board'
import './App.css';
import { Button } from 'react-bootstrap';
import { getLocalStorageItem, setLocalStorageItem } from './Helpers/helper';

function App() {
  const [newBoard, setnewBoard] = useState(false);
  const [createBoard, setcreateBoard] = useState(false);

  const createNewBoard = () => {
    setLocalStorageItem('boardtitle','Board Title');
    setnewBoard(true);
    setcreateBoard(false);
  }

  useEffect(() => {
    console.log(!newBoard && getLocalStorageItem('board'),'asd')
    if(!getLocalStorageItem('boardtitle')) {
      setcreateBoard(true);  
    }
  }, [])

  return (
    <div className="App">
      {
        createBoard
        ? <Button variant='success' className='create-board-button' onClick={createNewBoard}>
            Create Board
          </Button>: 
          <Board /> 
      }
    </div>
  );
}

export default App;
