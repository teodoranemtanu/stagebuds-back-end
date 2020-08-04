const concertsService = require('../services/concerts-service');
const profileService = require('../services/profiles-service');
const setlistService = require('../services/setlist-service');
const HttpError = require('../models/http-error');

const getConcertsByArtistName = async (req, res, next) => {
    const artist = req.body;
    let concerts;
    try {
        concerts = await concertsService.getConcertsByArtistName(artist.artistName);
    } catch (err) {
        return next(new HttpError(err.message, err.statusCode));
    }

    res.status(201).json({
        concerts
    });
};

const getSimilarArtists = async (req, res, next) => {
    const artist = req.body;
    let similarArtists;
    try {
        similarArtists = await concertsService.getSimilarArtists(artist.artistName);
    } catch (err) {
        return next(new HttpError(err.message, err.statusCode));
    }

    res.status(201).json({
        similarArtists
    });
};

const getConcertsByLocation = async (req, res, next) => {
    const location = req.body;
    let concerts;
    try {
        concerts = await concertsService.getConcertsByMetroArea(location);
    } catch (err) {
        return next(new HttpError(err.message, err.statusCode));
    }
    res.status(201).json({
        concerts
    });
};

const getConcertsByProfileInfo = async (req, res, next) => {
    const userId = req.userData.userId;
    const profileInfo = await profileService.findProfileByUserId(userId);
    // let similarArtists = [];
    let concerts = [];
    try {
        for (const band of profileInfo.bands) {
            const currentBandConcerts = await concertsService.getConcertsByArtistName(band);

            if (currentBandConcerts !== undefined)
                concerts = [...concerts, ...currentBandConcerts];
            console.log(concerts);
        }
    } catch (err) {
        return next(new HttpError(err.message, err.statusCode));
    }
    await res.status(201).json({
        concerts
    })
};

const getConcertsSetlist = async (req, res, next) => {
    const performances = req.body.performances;
    const futureSetlist = await concertsService.getConcertSetlist(performances);
    await res.status(201).json({
        data: futureSetlist
    })
};


exports.getConcertsByArtistName = getConcertsByArtistName;
exports.getSimilarArtists = getSimilarArtists;
exports.getConcertsByLocation = getConcertsByLocation;
exports.getConcertsByProfileInfo = getConcertsByProfileInfo;
exports.getConcertsSetlist = getConcertsSetlist;