const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Gpio = require("pigpio").Gpio;
const fs = require('fs');

//config data
var configFile = fs.readFileSync("config.json");
var config = JSON.parse(configFile);

//Servos
//hours -> 14
//minutes -> 15
//seconds -> 18
const hourServo = new Gpio(14, {mode: Gpio.OUTPUT});
const hourLight = new Gpio(25, {mode: Gpio.OUTPUT});
const minutesServo = new Gpio(15, {mode: Gpio.OUTPUT});
const minutesLight = new Gpio(8, {mode: Gpio.OUTPUT});
const secondsServo = new Gpio(18, {mode: Gpio.OUTPUT});
const secondsLight = new Gpio(7, {mode: Gpio.OUTPUT});

//Math
const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

//modes
var clockMode = true;
var secondsDir = false;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//backlight init
hourLight.pwmWrite(config.hours.bl);
minutesLight.pwmWrite(config.minutes.bl);
secondsLight.pwmWrite(config.seconds.bl);

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
  config.hours.bl = req.body.bl;
  fs.writeFileSync('config.json', JSON.stringify(config));
  hourLight.pwmWrite(req.body.bl);
  res.redirect("/");
});
app.post("/set/minutes/bl", function(req, res){
  config.minutes.bl = req.body.bl;
  fs.writeFileSync('config.json', JSON.stringify(config));
  minutesLight.pwmWrite(req.body.bl);
  res.redirect("/");
});
app.post("/set/minutes/bl", function(req, res){
  config.seconds.bl = req.body.bl
  fs.writeFileSync('config.json', JSON.stringify(config));
  secondsLight.pwmWrite(req.body.bl);
  res.redirect("/");
});

app.post("/set/hours/left", function(req, res){
  config.hours.left = req.body.left;
  fs.writeFileSync('config.json', JSON.stringify(config));
  res.redirect("/");
});
app.post("/set/minutes/left", function(req, res){
  config.minutes.left = req.body.left;
  fs.writeFileSync('config.json', JSON.stringify(config));
  res.redirect("/");
});
app.post("/set/seconds/left", function(req, res){
  config.seconds.left = req.body.left;
  fs.writeFileSync('config.json', JSON.stringify(config));
  res.redirect("/");
});

app.post("/set/hours/right", function(req, res){
  config.hours.right = req.body.right;
  fs.writeFileSync('config.json', JSON.stringify(config));
  res.redirect("/");
});
app.post("/set/minutes/right", function(req, res){
  config.minutes.right = req.body.right;
  fs.writeFileSync('config.json', JSON.stringify(config));
  res.redirect("/");
});
app.post("/set/seconds/right", function(req, res){
  config.seconds.right = req.body.right;
  fs.writeFileSync('config.json', JSON.stringify(config));
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
    //(num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    config.hours.left = config.hours.left + 0;
    config.minutes.left = config.minutes.left + 0;
    config.seconds.left = config.seconds.left + 0;
    config.hours.right = config.hours.right + 0;
    config.minutes.right = config.minutes.right + 0;
    config.seconds.right = config.seconds.right + 0;
    var hPos = Math.floor(config.hours.left - scale(date.getHours(), 0, 23, config.hours.right, config.hours.left)) + config.hours.right;
    var mPos = Math.floor(config.minutes.left - scale(date.getMinutes(), 0, 59, config.minutes.right, config.minutes.left)) + config.minutes.right;
    var sPos = Math.floor(config.seconds.left - scale(date.getSeconds(), 0, 23, config.seconds.right, config.seconds.left)) + config.seconds.right;

    if(hPos > 400 && hPos < 2300) hourServo.servoWrite(hPos);
    else console.log("Erroneous hpos: " + hPos);
    if(mPos > 400 && mPos < 2300) minutesServo.servoWrite(mPos);
    else console.log("Erroneous mpos: " + mpos);
    if(sPos > 400 && mPos < 2300) secondsServo.servoWrite(Math.floor(sPos) + config.seconds.right);
    else console.log("Erroneous spos: " + spos);
  }
}, 50);
