const Board = require("firmata");
express = require('express'),
app = express(),
port = 8000;
//initializing and declaring led rows
var column = [13,12,11,10,9,8,7,6,5,4,3,2,1,0,19,18];
//initializing and declaring led layers
var layer = [17,16,15,14];
var board = null

Board.requestPort(function(error, port) {
  if (error) {
    console.log(error);
    return;
  }

  board = new Board(port.comName);

  board.on("ready", function() {
    console.log("### Board ready!");
    board.sendI2CConfig();
  
    board.on("string", function(string) {
      console.log(string);
    });
    //setting rows to ouput
    for(var i = 0; i<16; i++)
    {
      board.pinMode(column[i], board.MODES.OUTPUT);
    }
    //setting layers to output
    for(var i = 0; i<4; i++)
    {
      board.pinMode(layer[i], board.MODES.OUTPUT);
    }
    
  });
});

function turnEverythingOff()
 {
   for(var i = 0; i<16; i++)
   {
    board.digitalWrite(column[i], board.HIGH);
   }
   for(var i = 0; i<4; i++)
   {
    board.digitalWrite(layer[i], board.LOW);
   }
 }

function turnEverythingOn()
{
  for(var i = 0; i<16; i++)
  {
    board.digitalWrite(column[i], board.LOW);
  }
  //turning on layers
  for(var i = 0; i<4; i++)
  {
    board.digitalWrite(layer[i], board.HIGH);
  }
}

function turnColumnsOff()
{
  for(var i = 0; i<16; i++)
  {
    board.digitalWrite(column[i], board.HIGH);
  }
}

function flickerOn()
{
    var i = 150;
    while(i != 0)
    {
      setInterval(function() {
        turnEverythingOn();
      }, i);
      setInterval(function() {
        turnEverythingOff();
      }, i);
      i-= 15;
    }
}

app.get('/ledcube/:mode', function (req, res) {
    var status = "NOK";
    switch(req.params.mode) {
      case "1":
        status = "OK";
        flickerOn();
        break;
      case "2":
        status = "OK";
        layerstompUpAndDown();
        break;
     case "blink":
      board.digitalWrite(layer[2], board.HIGH);
       break;
     case "stop":
     board.digitalWrite(layer[3], board.HIGH);
       break;
     default:
       status = "Unknown: " + req.params.mode;
       break;
     }
     console.log(status);
     res.send(status);
});

app.listen(port, function () {
 console.log('Listening on port ' + port);
});
