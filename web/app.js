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
    console.log("Express server running at " + app.get("port") + app.get("host"));
});

