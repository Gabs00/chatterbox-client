// YOUR CODE HERE:
$(document).ready(function(){
  window.p = new Parse();
  window.mlist = new MessageList();
  var room = 'lobby';
  function messageAdder(array){
    mlist.multipleAdd(array);
  }
  setInterval(function(){
    var result = mlist.removeMultiple(room);
    if(result && result.length > 0){
      _.each(result, function(v){
        $('.chat').append('<li>' + v.username + ': ' + v.text + '</li>');
      });
      
    }
  },3000);
  p.asyncLoop(p.getMessages, messageAdder, 3000);

  function send(text){
    var mess = new Message('Gabs00',text, 'lobby');
    p.sendMessage(mess.prepare(), console.log);
    p.getMessages(messageAdder);
  }

  $('form').on('submit', function(event){
    event.preventDefault();
    var text = $('.mess').val();
    console.log(text);
    send(text);
  });

});