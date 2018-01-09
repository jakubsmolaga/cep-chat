let generateMessage = (from, text, color) => {
  return {
    from,
    text,
    createdAt: new Date().toLocaleString(),
    color
  };
};

let generateLocationMessage = (from, lat, lng) => {
  let url = `http://google.com/maps/place/${lat},${lng}`;
  return {
    from,
    url,
    createdAt: new Date().toLocaleString()
  };
};

module.exports = {generateMessage, generateLocationMessage};
