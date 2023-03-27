var express = require('express');
var router = express.Router();
const sighting_controller = require("../controllers/sighting");


router.get('/details', async function(req, res) {
    try {
        const id = req.query.id;
        const sighting = await sighting_controller.getSightingById(id);
        // res.json(sighting)
        res.render('details', { sighting: sighting });
    } catch (err) {
        // handle error
        res.status(500).send('Internal server error');
    }
});



module.exports = router;
