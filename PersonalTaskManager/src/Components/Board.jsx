import React, { useState, useEffect } from 'react'
// import { Container } from 'react-bootstrap/lib/Tab';
import { Container, Row, Col, Button } from 'react-bootstrap';
import List from './List';
import { getLocalStorageItem, setLocalStorageItem, getNumberFromString, reorderArray } from '../Helpers/helper';
import '../Styles/board.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
const Board = () => {
    const [title, settitle] = useState('');
    const [lists, setlists] = useState([]);
    let boardData = getLocalStorageItem('board');
    const addNewList = () => {
        const newListData = lists ? [...lists] : [];
        boardData=getLocalStorageItem('board');
        let lastCreatedListId = getLocalStorageItem('lastcreatedlistid');
        const key = lastCreatedListId ? getNumberFromString(lastCreatedListId) : 1;
        const id = `li${key}`;
        setLocalStorageItem('lastcreatedlistid', id);
        if (boardData) {
            boardData[boardData.length] = id;
        } else {
            boardData = [id];
        }
        setLocalStorageItem('board', boardData);
        const totalListData = getLocalStorageItem('lists');
        const listData = totalListData
        ? { ...totalListData,
            [id] : {
                title: '',
                cards: []
            }
         }
        :
        {
            [id] : {
                title: '',
                cards: []
            }
        };
        setLocalStorageItem('lists', listData);
        newListData[newListData.length] = id;
        setlists(newListData);
    };

    const handleChange = (event) => {
        setLocalStorageItem('boardtitle', event.target.value);
        settitle(event.target.value);
    }

    const deleteList = listId => {
        boardData = boardData.filter(value => value !== listId);
        if (boardData.length === 0) {
            localStorage.removeItem('board');
        } else {
            setLocalStorageItem('board', boardData);
        }
        setlists(boardData);
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        
        const reorderedLists = reorderArray(lists, result.source.index, result.destination.index);
        boardData = reorderedLists;
        setLocalStorageItem('board', boardData);
        setlists(reorderedLists);
    };

    const getItemStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        padding: 2,
        margin: `0 1px 0 0`,
        minWidth: '400px',
        background: isDragging && 'lightgreen',
      
        // styles we need to apply on draggables
        ...draggableStyle,
      });
      
    
    const getListStyle = isDraggingOver => ({
        background: isDraggingOver ? 'lightblue' : 'lightgrey',
        display: 'flex',
        padding: 4,
        paddingTop: 60,
        marginLeft: 0,
        marginRight:10,
        overflow: 'auto',
        height: '100vh',
      });

    useEffect(() => {
        setlists(boardData);
        const boardTitle = getLocalStorageItem('boardtitle');
        settitle(boardTitle);
    }, []);

    return (
        <div className='board'>
             <input
                    type='text'
                    autoComplete='off'
                    name='title'
                    placeholder='Board Name'
                    className='board-title-input'
                    value={title}
                    onChange={handleChange}
                />
            {/* <Container>
                <Row> */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                        >
                            {
                                lists && lists.map((listId, index) => (
                                    <Draggable key={listId} draggableId={listId} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                              )}
                                            >
                                                <Col md={"auto"}>
                                            <List id={listId} deleteList={deleteList}/>
                                            </Col>
                                        </div> 
                                        )}
                                    </Draggable>
                                ))
                            }
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {/* </Row>
            </Container> */}
            <Button className='new-list-button' variant='success' onClick={addNewList}>New List</Button>
            {/* <Container>
                <Row>
                    {
                        lists && lists.map((listId, index) => (
                            <Col key={`key${index}`}>
                                <List id={listId} deleteList={deleteList}/>
                            </Col>
                        ))
                    }
                    <Col>
                        <Button variant='success' onClick={addNewList}>Add New List</Button>
                    </Col>
                </Row>
            </Container> */}
        </div>
    )
};

export default Board;