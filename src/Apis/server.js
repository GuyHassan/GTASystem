import axios from 'axios';

// export default axios.create({
//     baseURL: 
// });


const server = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

// const server = axios.create({
//   baseURL: 'http://localhost:3005'
// });

// process.env.REACT_APP_LOCALHOST_RESTFUL 


export { server };