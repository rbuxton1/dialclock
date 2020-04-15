const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Gpio = require("pigpio").Gpio;

//Servos
//hours -> 14
//minutes -> 15
//seconds -> 18
const hourServo = new Gpio(14, {mode: Gpio.OUTPUT});
const minutesServo = new Gpio(15, {mode: Gpio.OUTPUT});
const secondsServo = new Gpio(18, {mode: Gpio.OUTPUT});

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
  seconds.servoWrite(req.body.secondsServo);
  res.redirect("/");
});

app.listen(8080, function(){ console.log("Listening on port 3000!"); });
