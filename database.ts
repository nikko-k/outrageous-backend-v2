const db:Sequelize = require('./sequelize/index.js');

import errors from './errors';

import { Sequelize } from "sequelize/types";
import IDatabase from "./types/dbinterface";


export default class Database implements IDatabase {
	registerUser = async (email:string, firstName:string, hashedPass:string):Promise<any> => {
		const foundUser = await db.models.user.findOne({
			attributes: ['email'],
			where: { email },
		})

		if( foundUser ) {
			throw new errors.userexists;
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
		const attributes:string[] = fields || ['email', 'password']

		return db.models.user.findOne({
			attributes: attributes,
			where: {
				id
			}
		})
	}

	getGaragebyID = (id):Promise<any> => {
		// console.log(db.models.garage);
		return db.models.garage.findOne({
			// attributes: ['id'],
			where: {
				id
			}
		})
	}
}
