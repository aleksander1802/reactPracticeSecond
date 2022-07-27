

import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMesage';
import React, { useState, useEffect, useRef } from 'react';

import './comicsList.scss';



const ComicsList = () => {

    const {loading, error, getAllComics} = useMarvelService();

    const [comicList, setComicList ] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);
    

    useEffect(() => {
        onRequest(offset, true)
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true)
        getAllComics(offset)
            .then(onComicListLoaded)
    }

    const onComicListLoaded = (newComicList) => {
        let ended = false; 
        if (newComicList.length < 8) {
            ended = true;
        }
       
        setComicList([...comicList, ...newComicList]);
        
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    

    function comicListItems(comicList) {
        
        const items = comicList.map((item, id) => {
            
            return (
                    <li className="comics__item"
                    key={id}
                    >
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
            </li>
            )
        })
        
        
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const spinner = loading && !newItemLoading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;

    const items = comicListItems(comicList);

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {items}
            <button 
            disabled={newItemLoading} 
            style={{'display' : comicsEnded ? 'none' : 'block'}}
            className="button button__main button__long"
            onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;