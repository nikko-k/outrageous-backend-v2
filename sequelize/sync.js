const { Sequelize } = require('sequelize');

// Import models to sync.
const models = require('./models/index.ts');
const dotenv = require('dotenv');
const path = require('path');

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

	models.default(sequelize);
	await sequelize.sync({force:true});

	console.log("All models were synchronized successfully.");
	console.log('Models mapped to sequelize instance');

	process.exit(0);``
},
error => {
	console.log('Failed to connect to DB');
	console.log('Error code :', error);
	process.exit(1);
});