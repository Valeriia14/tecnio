import config from './config';

const headers = new Headers();
const base64Credentials = window.btoa(config.USER_NAME+':'+config.PASSWORD);
headers.append('Authorization', 'Basic ' + base64Credentials);
headers.append('Content-Type', 'application/json');

// get data from server.
function getData(start, end) {
  console.log(start,'start', end, 'end')
  return new Promise((resolve) => {  
    fetch(
      config.CORS_URL+
      config.HOST_URL+'/rest/0.1/unit/e661640843792f2d/sensor/3,50,60/history?start='+start +'&end='+end, {
        headers: headers,
        method: 'GET'
      }
    )
    .then((response) =>  response.json())
    .then((data) => resolve(data))
  })
}
export { getData };
