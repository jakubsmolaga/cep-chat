//test
//test3
let nickname = 'john';

let socket = io();

socket.on('connect', function () {
  console.log('connected to server');
  let params = jQuery.deparam(window.location.search);

  if(!params.nickname || !params.room){
    alert('name and room are required');
    window.location.href = '/';
  }

  socket.emit('join', params, function (err) {
    if(err) {
      alert(err);
      window.location.href = '/';
    }else {

    }
  })
});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('New message', message);
  let tmp='';
  if(message.from === 'Admin') tmp = ' class="admin__message"';
  let li = jQuery(`<li${tmp}></li>`);
  li.text(`${message.from}: ${message.text}`);
  if(message.from !== 'Admin') li.css('box-shadow', `0px 2px 3px #${message.color}`);

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
    from: nickname,
    text: jQuery('[name=message]').val()
  }, function () {

  });

  jQuery('[name=message]').val("");

});

let locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  jQuery('li').css('box-shadow', '0px 2px 3px green');

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
