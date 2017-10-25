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
  const timeSec = new Date().getSeconds() + period;
  const startTime = new Date(Date.now());
  const endTime = new Date(startTime.getTime() + period * 1000);
  const rule = `${timeSec} * * * * *`;
  schedule.scheduleJob({ start: startTime, end: endTime, rule: rule }, () => {
    cb()
  })
}
const minutesTimer = function(period, cb) {
  const timeMins = new Date().getMinutes() + period;
  const startTime = new Date(Date.now());
  const endTime = new Date(startTime.getTime() + period * 1000 * 60);
  const rule = `* ${timeMins} * * * *`;
  schedule.scheduleJob({ start: startTime, end: endTime, rule: rule }, () => {
    cb()
  })
}
const hoursTimer = function(period, cb) {
  const timeHrs = new Date().getHours() + period;
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
