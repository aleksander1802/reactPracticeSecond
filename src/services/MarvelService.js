
import {useHttp} from '../hooks/http.hook'

const useMarvelService = () => {


    const {loading, error, request, clearError} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=fd38edc9fbe8356ca70ec42560887e2b';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async (offset = 120) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return res.data.results.map(_transformComic);
    }

    
    

    const _transformCharacter = (char) => {
        
        return {
            id: char.id,
            name: char.name,
            description: !char.description ? 'No description. Visit Wiki!' : `${char.description.slice(0, 210)}...`,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
        
    }

    const _transformComic = (comics) => {

        return {
        id: comics.id,
        title: comics.title,
        description: comics.description,
        thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
        language: comics.textObjects.language || 'en-us',
        price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available'
        }
    }



    return {getAllCharacters, getCharacter, loading, error, clearError, getAllComics, getComic};
}

export default useMarvelService;





