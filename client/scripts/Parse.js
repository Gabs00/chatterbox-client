var Parse = function(){
  this.base = "https://api.parse.com/1/classes/";
  this.parseClass = "chatterbox";
  this.currentUrl = this.url;
  this.ObjectId = "";
  this.intIds = {};
  
};

Parse.prototype = {};

Parse.prototype.setObjectId = function(ObjectId){
  this.ObjectId = ObjectId || "";
};

Parse.prototype.setClass = function(parseClass){
  this.parseClass = parseClass || "chatterbox";
};

Parse.prototype.setcurrentUrl = function(parseClass, ObjectId){
  this.setClass(parseClass);
  this.setObjectId(ObjectId);
  this.currentUrl = this.base+this.parseClass+this.ObjectId;
  return this.currentUrl;
};

Parse.prototype.getCurrentUrl = function(){
  return this.currentUrl;
};

Parse.prototype.getMessages = function(callback, parseClass, ObjectId){
  if(typeof callback !== 'function'){
    throw "First arg should be a callback";
  }
  var url = this.setcurrentUrl(parseClass, ObjectId);

  url+= this.Filter( this.createdAtFilter() );

  $.ajax({
    url: url,
    type: 'GET',
    success: function(data){
      if(data.results.length > 0){
        callback(_.map(data.results, function(v){
          return v;
        }));
      }
    },
    error: function(data){
      console.log('Failed to get chatterbox data');
    }

  });
};
Parse.prototype.createdAtFilter = function(){
  if(this.lastTime === undefined){
    this.lastTime = new Date(Date.now());
    var mins = this.lastTime.getMinutes();
    this.lastTime.setMinutes(mins - 10);
  }
  var currentTime = new Date(Date.now());
  var filterObject = {
      createdAt: {
          $gte: {
              "__type":"Date",
              "iso": this.lastTime.toISOString()
            },
          $lte: {
              "__type":"Date",
              "iso": currentTime.toISOString()
          }
      }
    };
    this.lastTime = currentTime;
  return filterObject;
};
Parse.prototype.asyncLoop = function(func, callback, time, argsArray){
  var self = this;
  if(argsArray === undefined){
    argsArray = [];
  }
  argsArray.push(callback);
  this.intIds[JSON.stringify(func.toString())] = setInterval(function(){
    func.apply(self, argsArray);
  }, time);
};
Parse.prototype.clearAsyncLoop = function(func){
  clearInterval(this.intIds[JSON.stringify(func.toString())]);
};
Parse.prototype.Filter = function(whereClause){
  return "?where="+JSON.stringify(whereClause);
};

Parse.prototype.sendMessage = function(message, callback, parseClass, ObjectId){ 
  if(message.text === undefined){
    throw "Message does not contain anything";
  }
  else if(message.username === undefined){
    throw "Username not defined";
  }
  else if(typeof callback !== 'function'){
    throw "Callback should be a function";
  }
  var url = this.setcurrentUrl(parseClass, ObjectId)+'?'+ JSON.stringify(message);
  console.log(url);
  $.ajax({
    url: url,
    type:'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function(data){
      console.log('message sent');
    },
    error: function(data){
      console.log("Failed to send message");
    }
  });
};