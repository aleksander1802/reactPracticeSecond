

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../ErrorMessage/ErrorMesage';
import Skeleton from '../skeleton/Skeleton';


import './charInfo.scss';

const CharInfo = (props) => {

    const {error, loading, getCharacter, clearError} =  useMarvelService();

    const [char, setChar] = useState(null);
    
    useEffect(() => {
        updateChar();
    }, [props.charId])
   


    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
        .then(onCharLoaded)
    }

    const onCharLoaded = (char) => {
        setChar(char)
    }

        const skeleton = char || error || loading ? null : <Skeleton/>;
        const spinner = loading ? <Spinner/> : null;
        const errorMessage = error ? <ErrorMessage/> : null;
        const content = !(error || loading || !char) ? <View char={char}/> : null;

        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    
    
}

const View = ({char}) => {

    const {name, description, thumbnail, homepage, wiki, comics} = char;

    let style = {"objectFit": "cover"}; 
                if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                style = {"objectFit": "contain"};
}

    return (
        <>
            <div className="char__basics">
                    <img style={style} src={thumbnail} alt={name}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">

                    {comics.length === 0 ? 'This character did not take part in the comics' : null }

                    {comics.map((item, i) => {
                        if (i > 9) return;
                        return (
                            <li 
                        className="char__comics-item"
                        key={i}>
                            {item.name}
                        </li>
                        )
                    }) }
                    
                    
                </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;