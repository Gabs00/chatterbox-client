// YOUR CODE HERE:
window.app = {};
window.app.parse = new Parse();
window.app.MessageList = new MessageList();
window.app.RoomHistory = new MessageList();
window.room = 'lobby';
window.app.username = prompt('Please enter a username');
var lastRoom = room;
$(document).ready(function(){
  p = window.app.parse;
  mlist = window.app.MessageList;
  rlist = window.app.RoomHistory;

  

  setInterval(function(){
    display();
  },3000);
  p.asyncLoop(p.getMessages, messageAdder, 5000);

  

  $('.rooms').on('click', 'li', function(e){
    room = $(this).html();
    if(rlist._messages[room] === undefined){
      rlist._messages[room] = [];
    }
    console.log($(this));
    display();
  });

  $('form').on('submit', function(event){
    event.preventDefault();
    var text = $('.mess').val();
    console.log(text);
    send(text);
  });

});

var display = function(){
     var result = mlist.removeMultiple(room);
    if(lastRoom !== room){
      var pastMessages = rlist.getAllMessages(room);
      $('.chat').empty();
      _.each(pastMessages, function(v){
        $('.chat').append('<li>' + v.username + ': ' + v.text + '</li>');
      });
    }
    if(result && result.length > 0){
      _.each(result, function(v){
        rlist.addMessage(v);
        if(rlist._messages[room].length > 15){
          rlist.removeMessageFromTop(room);
        }
        $('.chat').append('<li>' + v.username + ': ' + v.text + '</li>');
      });
      
    }
    lastRoom = room;
  };
function messageAdder(array){
  mlist.multipleAdd(array);
  getRooms();
}
function getRooms(){
  var rooms = Object.keys(mlist._messages);
  $('.rooms').empty();
  _.each(rooms, function(v){
    $('.rooms').append('<li>'+v+'</li>');
  });
}
var send = function(text){
  var mess = new Message(app.username,text, room);
  p.sendMessage(mess.prepare(), console.log);
  p.getMessages(messageAdder);
};