const mongoose = require('mongoose');
const bookModel = mongoose.Schema({
    name : {
        type : String,
        require : true,
    },
    price : {
        type : String,
        require : true,
    },
    pages : {
        type : String,
        require : true,
    },
    authore : {
        type : String,
        require : true,
    },
    image : {
        type : String,
        require : true,
    },

});
const book = mongoose.model('book',bookModel);
module.exports = book;