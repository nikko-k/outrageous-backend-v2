const db:Sequelize = require('./sequelize/index.js');

import errors from './errors';

import { Sequelize } from "sequelize/types";
import IDatabase from "./types/dbinterface";
import { create } from 'domain';
import { json } from 'stream/consumers';


export default class Database implements IDatabase {
	registerUser = async (email:string, firstName:string, hashedPass:string):Promise<any> => {
		const foundUser = await db.models.user.findOne({
			attributes: ['email'],
			where: { email },
		})

		if( foundUser ) {
			throw new errors.userexists();
		}

		const user = await db.models.user.create({
			email,
			firstname: firstName,
			password: hashedPass,
		});

		const userID = user.getDataValue('id');
		const garage = await db.models.garage.create(
			{
				userID: user.getDataValue('id')
			}
		);
		console.log(garage.getDataValue('id'));

		user.setDataValue('garageID', garage.getDataValue('id'));
		user.save();

		return userID;
	}

	getUser = (email:string,fields?:string[]):Promise<any> => {
		// const attributes:string[] = fields || ['email', 'password']

		return db.models.user.findOne({
			// attributes: attributes,
			where: {
				email
			}
		});

	}
	getUserbyID = (id:string,fields?:string[]):Promise<any> => {
		const attributes:string[] = fields || ['id', 'email', 'password']

		return db.models.user.findOne({
			attributes: attributes,
			where: {
				id
			}
		})
	}

	getGarageByUser = (id):Promise<any> => {
		if(!id) {
			throw new errors.missingargument();
		}

		return db.models.garage.findOne({
			where:{
				userID: id
			}
		})
	}

	getCarByID = (id):Promise<any> => {
		if(!id) {
			throw new errors.missingargument();
		}

		return db.models.car.findOne({
			where:{
				id
			}
		})
	}

	getGaragebyID = (id):Promise<any> => {
		// console.log(db.models.garage);
		if(!id) {
			throw new errors.missingargument();
		}

		return db.models.garage.findOne({
			where: {
				id
			}
		})
	}

	createCar = async (car, userID):Promise<any> => {
		// console.log(db.models.garage);
		if(!car) {
			throw new errors.missingargument();
		}
		const createdCarID = '';

		const garage = await this.getGarageByUser(userID)
		const newCar = await db.models.car.create({
			year: car.year,
			make: car.make,
			model: car.model,
		});

		return createdCarID;
	}
}
