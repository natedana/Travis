const schedule = require('node-schedule');
const parser = require('cron-parser');

// input: term's timeStamp
// output: a message x time after

/* const date = '2017-10-24T22:16:26.679Z'; */
//
// const startTime = new Date(Date.now() + 2000 );
// const endTime = new Date(startTime.getTime() + 6000 );
// const rule = '* * * * * *'
// schedule.scheduleJob({ start: startTime, end: endTime, rule: rule }, () => {
//   console.log('every second');
// })

const secondsTimer = function(period, cb) {
  const seconds = new Date().getSeconds() + period
  const timeSec = seconds > 60 ? seconds - 60 : seconds;
  const startTime = new Date(Date.now());
  const endTime = new Date(startTime.getTime() + period * 1000);
  const rule = `${timeSec} * * * * *`;
  schedule.scheduleJob({ start: startTime, end: endTime, rule: rule }, () => {
    cb()
  })
}
const minutesTimer = function(period, cb) {
  const minutes = new Date().getMinutes() + period
  const timeMins = minutes > 60 ? minutes - 60 : minutes;
  const startTime = new Date(Date.now());
  const endTime = new Date(startTime.getTime() + period * 1000 * 60);
  const rule = `* ${timeMins} * * * *`;
  schedule.scheduleJob({ start: startTime, end: endTime, rule: rule }, () => {
    cb()
  })
}
const hoursTimer = function(period, cb) {
  const hours = new Date().getSeconds() + period
  const timeHrs = hours > 12 ? hours - 12 : hours;
  const startTime = new Date(Date.now());
  const endTime = new Date(startTime.getTime() + period * 1000 * 60 * 60);
  const rule = `* * ${timeHrs} * * *`;
  schedule.scheduleJob({ start: startTime, end: endTime, rule: rule }, () => {
    cb()
  })
}


module.exports = {
  delaySeconds: secondsTimer,
  delayMinutes: minutesTimer,
  delayHours: hoursTimer,
}
