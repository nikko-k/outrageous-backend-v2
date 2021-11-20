import { Sequelize } from 'sequelize';
import models from './models/index.ts';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve();

// Get env vars from dotenv 
dotenv.config({ path: __dirname + '/.env' });

// Define Sequelize instance.
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
});


sequelize.authenticate()
.then( () => {
	console.log('Connection to the database has been established successfully.');

	models.forEach( model => {
		try{
			model(sequelize);
		} catch (error) {
			console.log('Error code: ', error);
			process.exit(1);
		}
	});
	console.log('Models mapped to sequelize instance');
},
error => {
	console.log('Failed to connect to DB');
	console.log('Error code :', error);
	process.exit(1);
});

export default sequelize;