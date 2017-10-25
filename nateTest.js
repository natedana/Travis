const axios = require('axios');
const key1 = process.env.GOOGLE_SERVER_KEY1;
const key2 = process.env.GOOGLE_SERVER_KEY2;

axios.post('https://translation.googleapis.com/language/translate/v2?key='+key1, {
  q: ['truck'],
  target: 'zh-CN',
  format: 'text',
  source: 'en',
}).then(result => {
  console.log(result.data.data.translations);
}).catch(err => {
  console.log("ERR", err.response.status);
  console.log("ERR", err.response.data);
  console.log("ERR", err.response.data.error.errors);
});
