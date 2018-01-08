let nickname_box = jQuery('#nickname_box');
let room_box = jQuery('#room_box');


jQuery('form').on('submit', (e) => {
  if(room == '') room_box.val('public');
});
