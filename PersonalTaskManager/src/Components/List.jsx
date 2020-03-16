import React, { useState, useEffect } from 'react'
import Card from './Card';
import { getLocalStorageItem, setLocalStorageItem, getNumberFromString, reorderArray } from '../Helpers/helper';
import { Button } from 'react-bootstrap';
import '../Styles/list.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'

const List = props => {
    const [id, setid] = useState(null);
    const [title, settitle] = useState('');
    const [cards, setcards] = useState([]);
    const [changed, setchanged] = useState(false);
    let totalListData = getLocalStorageItem('lists');

    const addNewCard = () => {
        totalListData = getLocalStorageItem('lists');
        const listData = totalListData[id];
        const lastCreatedCardId = listData.lastCreatedCardId;
        console.log(listData,' --- ', lastCreatedCardId);
        const key = listData.cards.length ?
            getNumberFromString(lastCreatedCardId)
            : 1;
        const cardId = `${id}Cd${key}`
        listData.cards[listData.cards.length] = cardId;
        totalListData[id] = listData;
        setLocalStorageItem('lists',totalListData);
        const totalCardData = getLocalStorageItem('cards');
        const cardData = totalCardData
        ? { ...totalCardData,
            [cardId] : {
                title: '',
                description: '',
                comments: []
            }
        } :
        {
            [cardId] : {
                title: '',
                description: '',
                comments: []
            }
        }
        listData.lastCreatedCardId = cardId;
        totalListData[id] = listData;
        setLocalStorageItem('lists',totalListData);
        setLocalStorageItem('cards', cardData);
        setcards(listData.cards);
    };

    const handleChange = (event) => {
        settitle(event.target.value);
        setchanged(true);
    }

    const saveList = () => {
        const listData = {
            title,
            cards
        };
        totalListData[id] = listData;
        setLocalStorageItem('lists', totalListData);
        setchanged(false);
    }

    const deleteCard = cardId => {
        console.log(cardId);
        const listData = totalListData[id];
        listData.cards = listData.cards.filter((value) => value !== cardId);
        totalListData[id] = listData; 
        setLocalStorageItem('lists',totalListData);
        setcards(listData.cards);
    };

    const removeList = () => {
        totalListData = getLocalStorageItem('lists');
        const listData = totalListData[id];
        console.log('listData-----',listData)
        listData.cards.forEach(element => {
            deleteCard(element);
        });
        console.log('totallistdata 1 -----------',totalListData);
        delete totalListData[id];
        console.log('totallistdata 2 ------',totalListData);
        setLocalStorageItem('lists', totalListData);
        props.deleteList(id);
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        totalListData = getLocalStorageItem('lists');
        const listData = totalListData[id];

        const reorderedCards = reorderArray(cards, result.source.index, result.destination.index);
        listData.cards = reorderedCards;
        totalListData[id] = listData;
        setLocalStorageItem('lists', totalListData);
        setcards(reorderedCards);
    };

    useEffect(() => {
        const listData = totalListData[props.id];
        setid(props.id);
        settitle(listData.title);
        setcards(listData.cards);
    }, []);

    return (
        <div className="list" draggable={true}>
            <div className='list-title'>
                <input
                    type='text'
                    autoComplete='off'
                    name='title'
                    placeholder='List Name'
                    className='list-title-input'
                    value={title}
                    onChange={handleChange}
                />
                <FontAwesomeIcon className='delete-icon' icon={faMinusCircle} onClick={removeList}></FontAwesomeIcon>
            </div>
            {
                    changed && <Button
                                    className='update-title-button'
                                    variant='success'
                                    onClick={saveList}
                                >
                                    Update Title
                                </Button>
                }
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="vertical">
                    {(provided, snapshot) => (
                        <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        >
                            {
                                cards && cards.map((cardId, index) => (
                                    <Draggable key={cardId} draggableId={cardId} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            >
                                                <Card
                                                    id={cardId}
                                                    deleteCard={deleteCard}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            }
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <Button variant='success' onClick={addNewCard}>New Card</Button>
        </div>
    )
};

export default List;