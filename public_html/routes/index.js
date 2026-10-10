const express = require('express');
const router = express.Router();

const entries = require ('./entries');
const entryGenres = require ('./entry-genres');
const genres = require ('./genres');
const listEntries = require ('./list-entries');
const lists = require ('./lists');
const mediaConditions = require ('./media-conditions');
const relationships = require ('./relationships');
const users = require ('./users');

router.use('/', entries);
router.use('/', entryGenres);
router.use('/', genres);
router.use('/', listEntries);
router.use('/', lists);
router.use('/', mediaConditions);
router.use('/', relationships);
router.use('/', users);

module.exports = router;