const db:Sequelize = require('./sequelize/index.js');
const {onLoad} = require('./sequelize/index.js');

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

		user.setDataValue('garageID', garage.getDataValue('id'));
		user.save();

		return userID;
	}

	getUser = (email:string,fields?:string[]):Promise<any> => {
		return db.models.user.findOne({
			where: {
				email
			}
		});

	}
	getUserbyID = (id:string,fields?:string[]):Promise<any> => {
		const attributes = fields || null;

		return db.models.user.findOne({
			attributes,
			where: {
				id
			}
		})
	}

	getUserbyFacebookID = (facebookID:string):Promise<any> => {
		return db.models.user.findOne({
			where: {
				facebookID
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

	addFile = (file):Promise<any> => {
		return db.models.file.create({
			originalname: file.name,
			filename: file.newName,
			filepath: file.path,
			ispicture: file.isPicture,
			owner: file.userID
		})
	}

	getFile = (fileid):Promise<any> => {
		return db.models.file.findByPk(fileid)

	}

	getAllImages = ():Promise<any> => {
		return db.models.file.findAll({
			where: {
				ispicture: true
			}
		})

	}

	getAllFiles = ():Promise<any> => {
		return db.models.file.findAll();
	}
}
