import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://coolrecipes-f4e21.firebaseio.com/'
})

export default instance;
