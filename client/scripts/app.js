// YOUR CODE HERE:

var p = new Parse();
function placeHolder(data){console.log(data);}
p.asyncLoop(p.getMessages, placeHolder, 3000);

p.sendMessage({username:'Gabs00', text: 'test,test,test,test'}, placeHolder);