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

});

var app = {};

var user = window.location.search.split('username=')[1];

app.init = function () {

};

app.send = function (message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/messages',
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

app.fetch = function (url) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: url,
    type: 'GET',
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

app.clearMessages = function () {
  $('#chats').html('');
};

app.addMessage = function (message) {
  console.log('app.addMessage called');
  message.username;
  message.text;
  message.roomname;
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
    roomname: $('#roomSelect option:selected').text()
  };
  app.send(message);
  // app.addMessage(message);
};