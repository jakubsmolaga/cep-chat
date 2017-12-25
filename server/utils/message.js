let generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().getTime()
  };
};

let generateLocationMessage = (from, lat, lng) => {
  let url = `http://google.com/maps/place/${lat},${lng}`;
  return {
    from,
    url,
    createdAt: new Date().getTime()
  };
};

module.exports = {generateMessage, generateLocationMessage};
