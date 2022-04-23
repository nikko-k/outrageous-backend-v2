import Database from '../database';
import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt';

const database = new Database();

export default new LocalStrategy({usernameField: 'email', passwordField:'password'},
function(email, password, cb) {
    database.getUser(email)
        .then(value => {
            if( bcrypt.compareSync(password, value.dataValues.password) ) {
                const user:any = value.dataValues.email;
                cb(null,value);
            } else {
                cb(null, false, {message:"Incorrect user or password!"} );
            }
        })
        .catch(error => {
            console.log(error);
            cb(null, false, {message:"Incorrect user or password!"} );
        });
    }
);