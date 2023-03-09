const Character = require('../models/characters');

exports.character_insert = function (req, res) {
    const obj = req.body
    // JSON.parse(req.body)
    console.log(obj);

    let character = new Character({
        first_name : obj.firstName,
        family_name:obj.familyName,
        dob: obj.dob,
    })


    character.save(function (err, results) {
        if(err) throw err;
        console.log(results._id);
    });

    res.json({character: character});
}





