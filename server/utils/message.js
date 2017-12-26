let generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: new Date().toLocaleString()
  };
};

let generateLocationMessage = (from, lat, lng) => {
  let url = `http://google.com/maps/place/${lat},${lng}`;
  return {
    from,
    url,
    createdAt: new Date().tiLocaleString()
  };
};

module.exports = {generateMessage, generateLocationMessage};
