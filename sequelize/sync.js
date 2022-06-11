import { Sequelize } from 'sequelize';

// Import models to sync.
import models from './models/index.ts';
import dotenv from 'dotenv';
import path from 'path';

// Get env vars from dotenv
dotenv.config({ path: __dirname + '/../.env' });
// Define Sequelize instance.
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
});

sequelize.authenticate()
.then( async () => {
	console.log('Connection to the database has been established successfully.');

	models(sequelize);
	await sequelize.sync({force:true});

	console.log("All models were synchronized successfully.");
	console.log('Models mapped to sequelize instance');

	process.exit(0);
},
error => {
	console.log('Failed to connect to DB');
	console.log('Error code :', error);
	process.exit(1);
});