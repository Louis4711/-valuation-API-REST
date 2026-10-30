const database = require('../config/database.js');

require('../models/user.model.js');
require('../models/post.model.js');

async function sync() {
    try {
        await database.authenticate();

        await database.sync();

        console.log('Tables initialisées.');
    } catch (error) {
        console.error('Erreur pendant la synchronisation :', error);
        process.exitCode = 1;
    } finally {
        await database.close();
    }
}

sync();