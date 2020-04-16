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

//Math
const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//modes
var clockMode = true;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("index");
});

app.post("/set/hours/pos", function(req, res){
  hourServo.servoWrite(req.body.pos);
  res.redirect("/");
});
app.post("/set/minutes/pos", function(req, res){
  minutesServo.servoWrite(req.body.pos);
  res.redirect("/");
});
app.post("/set/seconds/pos", function(req, res){
  secondsServo.servoWrite(req.body.pos);
  res.redirect("/");
});

app.post("/set/hours/bl", function(req, res){
  hourLight.pwmWrite(req.body.bl);
  res.redirect("/");
});
app.post("/set/minutes/bl", function(req, res){
  minutesLight.pwmWrite(req.body.bl);
  res.redirect("/");
});
app.post("/set/minutes/bl", function(req, res){
  secondsLight.pwmWrite(req.body.bl);
  res.redirect("/");
});

app.post("/invertmode", function(req, res){
  clockMode = !clockMode;
  res.redirect("/");
});

app.listen(8080, function(){ console.log("Listening on port 8080!"); });

//clocking here
setInterval(() => {
  if(clockMode){
    var date = new Date();
    var hPos = left - scale(date.getHours(), 0, 23, right, left);
    var mPos = left - scale(date.getMinutes(), 0, 59, right, left);
    var sPos = left - scale(date.getSeconds(), 0, 59, right, left);

    hourServo.servoWrite(Math.floor(hPos) + right);
    minutesServo.servoWrite(Math.floor(mPos) + right);
    secondsServo.servoWrite(Math.floor(sPos) + right);
  }
}, 50);
