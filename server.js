const http = require('http');
const app = require('./app.js');
const database = require('./server/config/database.js');

async function launch() {
    try {
        const server = http.createServer(app);

        server.on("listening", () => {
            console.log("Le serveur est en route sur le port :" + 3001);
        })

        await database.authenticate();
        console.log("Connected to database");
        server.listen(3001);
    } catch (e) {
        console.error("Connection to database failed");
    }
}

launch();