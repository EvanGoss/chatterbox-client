$( document ).ready(function() {
  console.log( 'ready!' );

  $('#user').prepend('<h3>You are now signed-in as ' + user + '.</h3>');

  $('body').on('click', '.username', function () {
    app.toggleFriend($(this).text());
    app.toggleMessages('friend');
  });

  $('.change-user').on('click', function (event) {
    console.log('change user button clicked');
    app.changeUser($('#new-user').val());
  });

  $('.submit').on('click', function (event) {
    console.log('submit button clicked');
    app.handleSubmit();
  });

  $('#refresh').on('click', function (event) {
    console.log('refresh button clicked');
    app.fetch(serverUrl, app.displayMessages);
  });

  $('.new-room-submit').on('click', function (event) {
    console.log('add new room button clicked');
    var newRoom = $('#new-room').val();
    app.addRoom(newRoom);
    $('#room-select').val(newRoom);
    app.clearMessages();
    $('#new-room').val('');
  });

  $('#room-select').change(function() {
    app.fetch(serverUrl, app.displayMessages);
  });

});

var app = {};
var friends = {};

var user = window.location.search.split('username=')[1];
var userID;

var serverUrl = 'https://api.parse.com/1/classes/messages';
var usersUrl = 'https://api.parse.com/1/classes/users';

app.init = function () {

};

app.toggleMessages = function (classname) {
  // loop thru msgs
  $('#chats > li').each(function(index, msg) {
    console.log(index, msg);
    console.log($($(msg).children()[0]).text());
    var msgUser = $($(msg).children()[0]).text();
    if (friends[msgUser]) {
      $(msg).toggleClass(classname);
    }
  });
  // if username = target
    // add class 'friends'
};

app.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: serverUrl,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      $('#message').val('');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function (url, callback) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: url,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message fetched', data);
      callback(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch message', data);
    }
  });
};

app.toggleFriend = function (friend) {
  friends[friend] = !friends[friend];
  console.log(friends);
};

app.checkUser = function (data) {
  console.log('checkUser');
  data.results.forEach(function (item, index) {
    if (item.username === user) {
      userID = index;
    } else {
      return false;
    }
  });
};

app.displayMessages = function (data) {
  console.log('display messages invoked');
  app.clearMessages();
      
  data.results.filter(function(item) {
    return item.roomname === $('#room-select option:selected').text();
  })
  .forEach(function (item) {
    app.addMessage(item);
  });
};

app.clearMessages = function () {
  $('#chats').html('');
};

app.addMessage = function (message) {
  console.log('app.addMessage called');

  var escaped = _.escape(message.text);

  $('#chats').append('<li><a class="username">' + _.escape(message.username) 
    + '</a><p>' + escaped + '</p>'
    + '</li>');

  // $('#chats').append('<li><a class="username">' + _.escape(message.username) 
  //   + '</a><p>' + message.text + '</p>'
  //   + '</li>');
};

app.addRoom = function (room) {
  var escaped = _.escape(room);
  $('#room-select').append('<option>' + escaped + '</option>');
};

app.handleSubmit = function () {
  console.log('app.handleSubmit called');
  var message = {
    username: user,
    text: $('#message').val(),
    roomname: $('#room-select option:selected').text()
  };
  app.send(message);
  app.fetch(serverUrl, app.displayMessages);
};

app.getRooms = function () {
  app.fetch(serverUrl, app.updateRoomList);
};

app.updateRoomList = function (data) {
  console.log('update room list invoked');

  var roomName = _.uniq(_.pluck(data.results, 'roomname')).sort();
  roomName.forEach(function(room) {
    app.addRoom(room);
  }); 
};

app.changeUser = function(newUser) {
  window.location.search = "username=" + newUser;
  user = newUser;
};

app.getRooms();
app.fetch(serverUrl, app.displayMessages);

