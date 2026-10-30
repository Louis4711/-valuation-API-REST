const database = require('./../config/database.js');
//const {associate} = require('./../config/association.js')
const User = require('./../models/user.model.js');
//const Products = require('./../model/product.model.js');


async function sync(){
    await User.sync();
    await database.sync();
}

sync();