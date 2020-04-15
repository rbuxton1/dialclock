const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const GPIO = require("pigpio").Gpio;

//Servos
//hours -> 14
//minutes -> 15
//seconds -> 18
const hourServo = new GPIO(14, {mode: GPIO.OUTPUT});
const minutesServo = new GPIO(15, {mode: GPIO.OUTPUT});
const secondsServo = new GPIO(18, {mode: GPIO.OUTPUT});

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
