$( document ).ready(function() {
  console.log( 'ready!' );

  $('body').on('click', '.username', function () {
    app.addFriend();
  });

  $('.submit').on('click', function (event) {
    console.log('submit button clicked');
    // event.preventDefault();
    app.handleSubmit();
  });

  $('.new-room-submit').on('click', function (event) {
    console.log('add new room button clicked');
    // event.preventDefault();
    var newRoom = $('#new-room').val();
    app.addRoom(newRoom);
    $('#room-select').val(newRoom);
    app.clearMessages();
  });

  $('#room-select').change(function() {
    app.fetch(serverUrl, app.displayMessages);
  });

});

var app = {};

var user = window.location.search.split('username=')[1];

var serverUrl = 'https://api.parse.com/1/classes/messages';

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
    // data: JSON.stringify(message),
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

app.displayMessages = function (data) {
  console.log("display messages invoked");
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
  // <option value="Room1" selected>Room1</option>
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
  // app.addMessage(message);
};

app.getRooms = function () {
  app.fetch(serverUrl, app.updateRoomList);
};

app.updateRoomList = function (data) {
  console.log("update room list invoked");
   
  var roomName = _.uniq(_.pluck(data.results, 'roomname')).sort();
  roomName.forEach(function(room) {
    app.addRoom(room);
  }); 
 
};

app.getRooms();
app.fetch(serverUrl, app.displayMessages);