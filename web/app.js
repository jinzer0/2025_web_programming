let express = require("express");
let http = require("http");
let path = require("path");
let static_s = require("serve-static");
const https = require("https");
const fs = require("fs");

const options = {
    key: fs.readFileSync("cert.key"),
    cert: fs.readFileSync("cert.crt"),      
};

let app = express();
let router = express.Router();
app.set("port", process.env.PORT || 8080);
app.set("host", "172.16.164.92");
app.use(static_s(__dirname));

app.use(express.urlencoded());
app.use(express.json());

// app.use(function(req, res, next) {
//     console.log("첫번째 미들웨어 처리");
//     req.user = "Mike";
//     next();
// })

// app.get("/", function(req, res, next) {
//     console.log("두번재 미들웨어 처리");
//     res.writeHead(200, {"Content-Type": "text/html;charset=utf8"});
//     res.end("<h1>Express 서버에서 " + req.user + "가 응답한 결과입니다. </h1>");
//     next();
// });

// 실습 1
// http://localhost:8080/ 주소로 접근시 jquery.html로 redirect
router.route("/").get(function(req, res) {
    res.redirect("/source/jquery.html");
});


router.route("/rss").get(function(req, res) {
    console.log("rss daa requested");
    let feed = "https://d2.naver.com/d2.atom";
    https.get(feed, function(httpres) {
        let rss_res = "";
        httpres.on("data", function(chunk) {rss_res += chunk;});
        httpres.on("end", function() {
            res.send(rss_res);
            console.log("rss response completed");
            res.end();
        });
    });
});



// 실습 1
// http://localhost:8080/routetest 주소로 접근시 http://www.google.com으로 redirect
router.route("/routetest").get(function(req, res) {
    res.redirect("http://www.google.com");
});

app.use(router);


app.use((req, res) => {
    res.status(404).send("<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>");
});


http.createServer(app).listen(app.get("port"), app.get("host"), () => {
    console.log("Express server running at " + app.get("port") + " - " + app.get("host"));
});

const PORT = 8000;
https.createServer(options, app).listen(PORT, app.get("host"), () => {
        console.log("Express HTTPS server running at " + app.get("port") + " - " + app.get("hostname"));

});