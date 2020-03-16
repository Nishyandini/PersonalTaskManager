import React, { useState, useEffect } from 'react'
import { getLocalStorageItem, setLocalStorageItem, getCurrentDate } from '../Helpers/helper';
import { Button } from 'react-bootstrap';
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
import '../Styles/card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons'

const Card = (props) => {
    const [id, setid] = useState(null);
    const [title, settitle] = useState('');
    const [description, setdescription] = useState('');
    const [comment, setcomment] = useState('');
    const [comments, setcomments] = useState([]);
    const [showSaveButton, setshowSaveButton] = useState(false);
    let totalCardData = getLocalStorageItem('cards');

    const handleChange = event => {
        if (event.target.name === 'title') {
            settitle(event.target.value);
        } else if(event.target.name === 'description') {
            setdescription(event.target.value);
        } else {
            setcomment(event.target.value);
        }
        setshowSaveButton(true);
    }

    const addComment = () => {
        let newComments = [...comments];
        let index = comments.length;
        newComments[index] = {
            text : comment,
            date : getCurrentDate()
        }
        setcomments(newComments);
        setcomment('');
    }

    const saveCard = () => {
        const cardData = {
            title,
            description,
            comments
        };
        totalCardData[id] = cardData;
        setLocalStorageItem('cards', totalCardData);
        setshowSaveButton(false);
    };

    const removeCard = () => {
        props.deleteCard(id);
    }

    useEffect(() => {
            const cardData = totalCardData[props.id];
            setid(props.id);
            settitle(cardData.title);
            setdescription(cardData.description);
            setcomments(cardData.comments);
    }, []);

    return (
        <div className='card task-card'>
            <div className='card-title'>
                <input
                    type='text'
                    autoComplete='off'
                    name='title'
                    placeholder='Card Title'
                    className='card-title-input'
                    value={title}
                    onChange={handleChange}
                />
                
                <FontAwesomeIcon className='delete-icon' icon={faMinusCircle} onClick={removeCard}></FontAwesomeIcon>
            </div>
            <textarea
                autoComplete='off'
                name='description'
                placeholder='Description'
                className='card-textarea-input'
                value={description}
                onChange={handleChange}
            />
            <textarea
                autoComplete='off'
                name='comment'
                placeholder='Comment'
                className='card-textarea-input'
                value={comment}
                onChange={handleChange}
            />
            <Button
                className='card-addcomment-button'
                variant={comment.length ===0 ? 'secondary' : 'primary'}
                disabled={comment.length === 0}
                onClick={addComment}
            >
                Add Comment
            </Button>
            {
                comments && comments.map((comment,index) => (
                    <div key={`key${index}`} className="comments">
                        <div className="comment-text">{comment.text}</div>
                        <div className="comment-date">{comment.date}</div>
                    </div>
                ))
            }
            
            {
                showSaveButton && <Button variant='success' onClick={saveCard}>Update Card</Button>
            }
        </div>
    )
}

export default Card;