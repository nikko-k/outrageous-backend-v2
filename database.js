db = require('./sequelize/index.js');
// import IDatabase from './types/dbinterface';
// import Models from './sequelize/models/index';

// const getModel () => {
    
// }

// export default class Database extends IDatabase {
//     registerUser = (email, pw) => {
        
//     }
// }

async () => {
    await db.sync({ force: true });
}