const express = require('express');
const router = express.Router();
const { autocomplete } = require('../controllers/searchController');
const { authenticateUser } = require('../middlewares/authMiddleware');

router.get('/autocomplete', authenticateUser, autocomplete);

module.exports = router;
