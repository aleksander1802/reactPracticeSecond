
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './charList.scss';


const CharList = (props) => {

    const {loading, error, getAllCharacters} = useMarvelService();

    const [charList, setCharList ] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

   
    
    useEffect(() => {
        onRequest(offset, true)
    }, [])

    

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllCharacters(offset)
            .then(onCharListLoaded)
    }

 

    const onCharListLoaded = (newCharList) => {
        
        let ended = false; 
        if (newCharList.length < 9) {
            ended = true;
        }

       
        setCharList(charList =>  [...charList, ...newCharList]);
        
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended => ended);
    }

   

    const refItems = useRef([]);

    const onFocusRef = (ind = ind + 1) => {
        refItems.current.forEach(item => item.classList.remove('char__item_selected'));
        refItems.current[ind].classList.add('char__item_selected');
        refItems.current[ind].focus();
    }


    function charListItems(charList) {
        
        const items = charList.map((item, ind) => {
                let style = {"objectFit": "cover"}; 
                if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                style = {"objectFit": "unset"};
            } 
            return (
                     <li 
                    tabIndex={0}
                    ref={elem => refItems.current[ind] = elem}
                    className="char__item"
                    key = {ind}
                    onClick={() => {
                        props.onCharSelected(item.id)
                        onFocusRef(ind);
                    }}
                    onKeyUp={(e) => {
                        if (e.key === 'Tab') {
                            props.onCharSelected(item.id)
                            onFocusRef(ind);
                        }
                    }}>
                        <img style={style} src={item.thumbnail} alt={item.name}/>
                        <div className="char__name">{item.name}</div>
                    </li>
            )
        })
        
        
        return (
            <ul 
            className="char__grid">
                {items}
            </ul>
        )
    }

   

   


    
    
    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    const items = charListItems(charList);

    
    
    


    return (
        <div className="char__list">
            {spinner}
            {errorMessage}
            {items}
            <button 
                className="button button__main button__long"
                disabled = {newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div 
                    className="inner"
                    style={{'display': newItemLoading ? 'none' : 'block'}}>
                    Load more
                </div>
            </button>
        </div>
    )

    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;