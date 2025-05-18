let express = require("express");
let http = require("http");
let static_s = require("serve-static");

let app = express();
app.set("port", process.env.PORT || 8080);
app.set("host", "127.0.0.1");
app.use(static_s(__dirname));

http.createServer(app).listen(app.get("port"), app.get("host"), () => {
    console.log("Express server running at " + app.get("port") + app.get("host"));
})