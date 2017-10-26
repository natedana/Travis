const newRes = function(text,data = {},contextOut = [],source = '',followup = {}) {
  return {
    text:text,
    speech: text,
    data: data,
    contextOut: contextOut,
    source: source,
    followupEvent: followup
  }
}
module.exports = newRes
