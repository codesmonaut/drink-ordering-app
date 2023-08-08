const fs = require(`fs`);
const path = require(`path`);
const express = require(`express`);
const multer = require(`multer`);

const Drink = require(`../models/Drink`);
const handleError = require(`../utils/handleError`);



// MULTER CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'img/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload = multer({ storage: storage });



// ROUTER CONFIG
const router = express.Router();

// Get all drinks
router.get(`/`, async (req, res) => {

    try {
        
        const drinks = await Drink.find();

        res.status(200).json({
            status: 200,
            results: drinks.length,
            data: {
                drinks: drinks
            }
        })

    } catch (err) {
        handleError(res, err);
    }
})

// Get one drink
router.get(`/:id`, async (req, res) => {

    try {

        const drink = await Drink.findById(req.params.id);

        res.status(200).json({
            status: 200,
            data: {
                drink: drink
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Create drink
router.post(`/`, upload.single(`image`), async (req, res) => {

    try {

        const filteredBody = {
            name: req.body.name,
            image: req.file.filename,
            drinkType: req.body.drinkType,
            size: req.body.size,
            available: req.body.available,
            included: req.body.included
        }

        const newDrink = await Drink.create(filteredBody);

        res.status(201).json({
            status: 201,
            data: {
                drink: newDrink
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Update drink
router.patch(`/:id`, upload.single(`image`), async (req, res) => {

    try {

        const filteredBody = {
            name: req.body.name,
            image: req.file.filename,
            drinkType: req.body.drinkType,
            size: req.body.size,
            available: req.body.available,
            included: req.body.included
        }

        const updatedDrink = await Drink.findByIdAndUpdate(req.params.id, filteredBody, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 200,
            data: {
                drink: updatedDrink
            }
        })
        
    } catch (err) {
        handleError(res, err);
    }
})

// Delete drink
router.delete(`/:id`, async (req, res) => {

    try {

        const drink = await Drink.findById(req.params.id);

        fs.unlink(`./img/${drink.image}`, err => {

            if (err) {
                console.log(err.message);
            }
        })

        await Drink.findByIdAndDelete(req.params.id);

        res.status(204).json(null);
        
    } catch (err) {
        handleError(res, err)
    }
})

module.exports = router;