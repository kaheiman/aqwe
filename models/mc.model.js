var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var McSchema = Schema({
    //creator: { type: Schema.Types.ObjectId, ref: 'User' },
    //ownername: { type: String, ref: 'User' },
    title: {
        type:String,
        required: true,
        default: ''
    },
    question:{
        type:String,
        required: true,
        default: ''        
    },
    choiceA:{ type: String, default:''},
    choiceB:{ type: String, default:''},
    choiceC:{ type: String, default:''},
    choiceD:{ type: String, default:''},
    launched:{ type:Boolean, default: false},
    explain:{ type: String, default: ''},
    ans:{ type: String, enum: ['a', 'b', 'c', 'd'], default: 'a'},
    tags: [{ type:String, default: ''}],
    popularity: {
        view: { type: Number, default: 0 },
        like: { type: Number, default: 0 },
        comment: { type: Number, default: 0 }
    },
    created: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('McSchema', McSchema);

module.exports.initMc = function(newMc, callback) {
    console.log("i am called");
    var newSchema = new McSchema(newMc);
    console.log(newSchema);
    newSchema.save(callback);
};