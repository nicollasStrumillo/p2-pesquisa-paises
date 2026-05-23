import axios from 'axios';

const restCountriesClient = axios.create({
  baseURL: 'https://restcountries.com/v3.1/',
});

export default restCountriesClient;