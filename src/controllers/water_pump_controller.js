const WaterPump = require('../models/waterPump.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

class WaterPumpController{
  createUser = async (req, res,next) => {
     this.checkValidation(req);
    const result = await WaterPump.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');}

        res.status(201).send('Water Pump was created!');
  };

  checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}

module.exports = new WaterPumpController;