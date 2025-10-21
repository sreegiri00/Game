// routes/gameRoutes.js

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/games', gameController.createGame);
router.get('/games/:gameId', gameController.getGameByGameId);
router.post('/games/:gameId/users', gameController.addUserToGame);
router.delete('/games/:gameId/users', gameController.removeUserFromGame);
router.post('/games/:gameId/events', gameController.recordEvent);
router.get('/games/:gameId/events', gameController.getEvents);
router.post('/games/:gameId/end', gameController.endGame);

module.exports = router;
