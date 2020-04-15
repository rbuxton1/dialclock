const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Gpio = require("pigpio").Gpio;

//Servos
//hours -> 14
//minutes -> 15
//seconds -> 18
const hourServo = new Gpio(14, {mode: Gpio.OUTPUT});
const hourLight = new Gpio(25, {mode: Gpio.OUTPUT});
const minutesServo = new Gpio(15, {mode: Gpio.OUTPUT});
const minitesLight = new Gpio(8, {mode: Gpio.OUTPUT});
const secondsServo = new Gpio(18, {mode: Gpio.OUTPUT});
const secondsLight = new Gpio(7, {mode: Gpio.OUTPUT});

//positions
var left = 2200;
var right = 700;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("index");
});

app.post("/setHours", function(req, res){
  hourServo.servoWrite(req.body.hourServo);
  res.redirect("/");
});
app.post("/setMinutes", function(req, res){
  minutesServo.servoWrite(req.body.minutesServo);
  res.redirect("/");
});
app.post("/setSeconds", function(req, res){
  secondsServo.servoWrite(req.body.secondsServo);
  res.redirect("/");
});

app.post("/setHoursLight", function(req, res){
  hourLight.pwmWrite(req.body.hourLight);
  res.redirect("/");
});
app.post("/setMinutesLight", function(req, res){
  minutesLight.pwmWrite(req.body.minutesLight);
  res.redirect("/");
});
app.post("/setSecondsLight", function(req, res){
  secondsLight.pwmWrite(req.body.secondsLight);
  res.redirect("/");
})

app.listen(8080, function(){ console.log("Listening on port 8080!"); });

//clocking here
setInterval(() => {
  var date = new Date();
  var hPos = ((1500 / 24) * date.getHours()) + right;
  var mPos = ((1500 / 60) * date.getMinutes()) + right;
  var sPos = ((1500 / 60) * date.getSeconds()) + right;

  hourServo.servoWrite(hPos);
  minutesServo.servoWrite(mPos);
  secondsServo.servoWrite(sPos); 
}, 250);
