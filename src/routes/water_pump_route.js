const express = require('express');
const router = express.Router();
const waterPumpController = require('../controllers/water_pump_controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.post('/add', auth(), awaitHandlerFactory(waterPumpController.createUser));



module.exports = router;