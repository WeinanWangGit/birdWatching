const mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create a shema
var characterSchema = new Schema({
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    dob: {type: Number},
})



var Character = mongoose.model('Character', characterSchema);

module.exports = Character;