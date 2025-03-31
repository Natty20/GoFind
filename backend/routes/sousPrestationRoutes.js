const express = require('express');
const router = express.Router();
const { getAllSousPrestations, addSousPrestation, updateSousPrestation, getSousPrestationById, 
    deleteSousPrestation, getSousPrestationsByPrestation, getSousPrestationWithPrestataires } = 
    require('../controllers/sousPrestationController');
const { authenticateUser, authorizeAdmin } = require('../middlewares/authMiddleware');

router.get('/', getAllSousPrestations); 
router.post('/:prestationId', authenticateUser, authorizeAdmin, addSousPrestation); 
router.put('/:id', authenticateUser, authorizeAdmin, updateSousPrestation);
router.get('/:id', getSousPrestationById);
router.delete('/:id', authenticateUser, authorizeAdmin, deleteSousPrestation);
router.get("/prestation/:prestationId", getSousPrestationsByPrestation);
router.get("/:id/prestataires", getSousPrestationWithPrestataires);

module.exports = router;