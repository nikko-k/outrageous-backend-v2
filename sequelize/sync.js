import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';


// Import models to sync.
import models from './models/index.ts';
import dotenv from 'dotenv';
import path from 'path';

// Get env vars from dotenv
dotenv.config({ path: __dirname + '/../.env' });
// Define Sequelize instance.

if( process.env.NODE_ENV == 'production') {
	console.log('Cannot run sync in production');
	process.exit(1);
}

mysql.createConnection({ host: process.env.DB_HOST, user: process.env.DB_USERNAME, password: process.env.DB_PASSWORD })
	.then( (connection) => {
		connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`)
			.then( value => {
				console.log('DB Created');
				init();
			});
	})
	.catch( error => {
		console.log('Error Creating database connection');
		console.log(error);
		process.exit(1);
	});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: 'mysql'
});

const init = () => {

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
}