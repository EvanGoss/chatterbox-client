$( document ).ready(function() {
  console.log( 'ready!' );

  $('body').on('click', '.username', function () {
    app.addFriend();
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

var user = window.location.search.split('username=')[1];
var userID;

var serverUrl = 'https://api.parse.com/1/classes/messages';
var usersUrl = 'https://api.parse.com/1/classes/users';

app.init = function () {

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

// GET USERS
// users array stored in data.results
app.fetchUsers = function (callback) {
  console.log('fetchusers');
  $.ajax({
    url: usersUrl,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('fetchUsers success data:', data);
      callback(data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('fetchUsers fail data:', data);
    }
  });
};

// CREATE USER
app.addUser = function (username) {
  console.log('addUser');
  var newUser = {
    username: username,
    friends: {}
  };

  $.ajax({
    url: usersUrl,
    type: 'POST',
    data: JSON.stringify(newUser),
    contentType: 'application/json',
    success: function (data) {
      console.log('success!', data);
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('fail!', data);
    }
  });
};

app.addFriend = function (url, newFriend) {
  console.log('addFriend');
  $.ajax({
    url: usersUrl,
    type: 'PUT',
    data: JSON.stringify(data.results[0].friends.newFriend = true),
    contentType: 'application/json',
    success: function (data) {
      console.log('success!');
      // $('#message').val('');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('fail!', data);
    }
  });
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

app.initUser = function () {
  console.log('initUser');
  if ( app.fetchUsers(app.checkUser) === false) {
    console.log('user not found');
    app.addUser(user);
  }
  console.log('initUser complete');
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

  $('#chats').append('<li><a class="username">' + message.username 
    + '</a><p>' + message.text + '</p>'
    + '</li>');
};

app.addRoom = function (room) {
  $('#room-select').append('<option>' + room + '</option>');
};

app.addFriend = function (friend) {
  console.log('addFriend called');
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

app.getRooms();
app.fetch(serverUrl, app.displayMessages);
app.initUser();
