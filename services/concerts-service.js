const dotenv = require('dotenv');
const axios = require('axios');
const HttpError = require('../models/http-error');
const setlistService = require('../services/setlist-service');
dotenv.config();

const getArtistId = async (artistName) => {
    let response;
    try {
        response = await axios.get(
            `https://api.songkick.com/api/3.0/search/artists.json?apikey=${process.env.SONGKICK_API_KEY}&query=${artistName}`
        );
        // console.log(response.data.resultsPage.results.artist[0].id);
    } catch (err) {
        return new HttpError(err.message, err.statusCode);
    }
    return response.data.resultsPage.results.artist[0].id;
};

const getConcertsByArtistId = async (artistId) => {
    let response;
    try {
        response = await axios.get(`https://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=${process.env.SONGKICK_API_KEY}`)
    } catch (err) {
        return new HttpError(err.message, err.statusCode);
    }
    return  response.data.resultsPage.results.event;
};

const getConcertsByArtistName = async (artistName) => {
    let response;
    const artistId = await getArtistId(artistName);
    try {
        response = await axios.get(`https://api.songkick.com/api/3.0/artists/${artistId}/calendar.json?apikey=${process.env.SONGKICK_API_KEY}`)
        // console.log(response.data.resultsPage.results.event)
    } catch (err) {
        return new HttpError(err.message, err.statusCode);
    }
    return  response.data.resultsPage.results.event;
};

const getSimilarArtists = async (artistName) => {
    let response;
    const artistId = await getArtistId(artistName);
    try {
        response = await axios.get(`https://api.songkick.com/api/3.0/artists/${artistId}/similar_artists.json?apikey=${process.env.SONGKICK_API_KEY}`)
        // console.log(response.data.resultsPage.results.event)
    } catch (err) {
        return new HttpError(err.message, err.statusCode);
    }
    return response.data.resultsPage.results.artist;
};

const getMetroAreaByLocation = async (location) => {
    let response;
    try {
        response = await axios.get(`https://api.songkick.com/api/3.0/search/locations.json?location=geo:${location.lat},${location.lng}&apikey=${process.env.SONGKICK_API_KEY}`);
    } catch (err) {
        return new HttpError(err.message, err.statusCode);
    }
    return response.data.resultsPage.results.location[0].metroArea.id;
};

const getConcertsByMetroArea = async (location) => {
    const metroAreaId = await getMetroAreaByLocation(location);
    let response;
    try {
        response = await axios.get(`https://api.songkick.com/api/3.0/metro_areas/${metroAreaId}/calendar.json?apikey=${process.env.SONGKICK_API_KEY}`)
    } catch (err) {
        return new HttpError(err.message, err.statusCode);
    }
    return response.data.resultsPage.results.event;
};

const getConcertSetlist = async (performances) => {
    let futureSetlists = [];
    for(performance of performances) {
        let mbIdentifiers = performance.artist.identifier;
        let futureSetlist;

        if(mbIdentifiers.length >= 1) {
            futureSetlist = await setlistService.getFutureSetlist(mbIdentifiers);
            futureSetlists = [...futureSetlists, {
                artist: performance.artist.displayName,
                futureSetlist
            }];
        }
    }
    return futureSetlists;
};

exports.getArtistId = getArtistId;
exports.getConcertsByArtistName = getConcertsByArtistName;
exports.getSimilarArtists = getSimilarArtists;
exports.getConcertsByMetroArea = getConcertsByMetroArea;
exports.getConcertsByArtistId = getConcertsByArtistId;
exports.getConcertSetlist = getConcertSetlist;