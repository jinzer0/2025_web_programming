let express = require("express");
let http = require("http");
let path = require("path");
let static_s = require("serve-static");

let app = express();
let router = express.Router();
app.set("port", process.env.PORT || 8080);
app.set("host", "127.0.0.1");
app.use(static_s(__dirname));

app.use(express.urlencoded());
app.use(express.json());

http.createServer(app).listen(app.get("port"), app.get("host"), () => {
    console.log("Express server running at " + app.get("port") + app.get("host"));
});

