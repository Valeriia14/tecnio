import { eachHourOfInterval } from "date-fns";
import { faker } from "@faker-js/faker";
import config from './config';
import axios from 'axios';
axios.defaults.withCredentials = true;
// generate data from faker.
function getData(start, end) {
  const interval = eachHourOfInterval({ start, end }).map((d) =>
    new Intl.DateTimeFormat("en", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d)
  );

  return new Promise((res) => {
    setTimeout(() => {
      res({
        names: {
          0: "binned_timetamp",
          1: "3",
          2: "50",
          3: "60",
        },
        types: {
          0: {
            ScalarType: "TIMESTAMP",
          },
          1: {
            ScalarType: "DOUBLE",
          },
          2: {
            ScalarType: "DOUBLE",
          },
          3: {
            ScalarType: "DOUBLE",
          },
        },
        data: {
          0: interval,
          1: interval
            .map(() => faker.number.float({ min: 17, max: 20 }))
            .sort(),
          2: interval
            .map(() => faker.number.float({ min: 0.2, max: 0.4 }))
            .sort(),
          3: interval
            .map(() => faker.number.float({ min: 25, max: 28 }))
            .sort(),
        },
      });
    }, Math.random() * 2000);
  });
}
// get data from server.
function getDatas(start, end) {
  return new Promise((resolve) => {
    
    axios.get(config.HOST_URL+'/rest/0.1/unit/e661640843792f2d/sensor/3,50,60/history?start='+start +'&end='+end, {
      headers: {
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        
      },
    })
    .then((response) =>  response.json())
    .then((data) => resolve(data))
  })
}
export { getData };
