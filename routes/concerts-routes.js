const express = require('express');
const concertsController = require('../controllers/concerts-controller');
const authCheck = require('../middleware/chech-auth');

const router = express.Router();

router.use(authCheck);
router.get('/artists/concerts', concertsController.getConcertsByProfileInfo);
router.post('/artistName/concerts', concertsController.getConcertsByArtistName);
router.post('/artistName/similar', concertsController.getSimilarArtists);
router.post('/location/concerts', concertsController.getConcertsByLocation);
router.post('/concerts/setlist', concertsController.getConcertsSetlist);

module.exports = router;