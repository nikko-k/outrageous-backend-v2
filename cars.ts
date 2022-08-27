import AxiosNotDefined from "./errors/axiosnotdefined.error";
const axios = require('axios');

export default class Cars {
	API_KEY = '';
	API_HOST = '';
	API_URL = '';

	axios = null;

	constructor(key:string, host:string, url:string) {
		this.API_KEY = key
		this.API_HOST = host
		this.API_URL = url

		this.axios = axios.create({
			baseURL: this.API_URL,
			headers: {
				"X-RapidAPI-Key" : this.API_KEY,
				"X-RapidAPI-Host" : this.API_HOST,
			}
		});
	}

	getCarMakes = async () => {
		if(! axios) {
			throw new AxiosNotDefined;
		}
		return this.axios.get( '/cars/makes' );
	}

	getFilteredCars = async (year = null, make = null, model = null) => {
		if(! axios) {
			throw new AxiosNotDefined;
		}
		return this.axios.get( '/cars', {
			params: {
				year,
				make,
				model
		} } );
	}
}