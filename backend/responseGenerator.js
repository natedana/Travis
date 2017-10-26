// const defaultData = {
//   data:
// };

// what is DialogFlow's default data anyways?
const newRes = (displayText, data = {}, contextOut = [], source = '') => {
  return {
    speech: displayText,
    displayText,
    data,
    contextOut,
    source,
  };
};

module.exports = newRes;
