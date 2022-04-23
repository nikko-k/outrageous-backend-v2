const db:Sequelize = require('./sequelize/index.js');

import { Sequelize } from "sequelize/types";
import IDatabase from "./types/dbinterface";


export default class Database implements IDatabase {

	registerUser = async (email:string, firstName:string, hashedPass:string):Promise<any> => {
		return db.models.user.findOrCreate({
			where: {
				email
			},
			defaults: {
				email,
				firstname: firstName,
				password: hashedPass
			}
		})
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
}
