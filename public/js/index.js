//test

let socket = io();

socket.on('connect', function () {
  console.log('connected to server');
});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('New message', message);
  let li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);

  let timeStamp = jQuery('<p class="timeStamp"></p>');
  timeStamp.text(message.createdAt);
  li.append(timeStamp);

  jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
  console.log('New location message', message);
  let li = jQuery('<li></li>');
  let a = jQuery('<a target="_blank">My Location!</a>');

  a.attr('href', message.url);
  li.text(`${message.from}: `);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  if (jQuery('[name=message]').val() == '') return;

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  });

  jQuery('[name=message]').val("");

});

let locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser!');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.')
  });
})
