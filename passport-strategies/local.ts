import Database from '../database';
import LocalStrategy from 'passport-local'
import bcrypt from 'bcrypt';

const database = new Database();

export default new LocalStrategy({usernameField: 'email', passwordField:'password'},
function(email, password, cb) {
	if(! email) {
		cb(null, false, {message:"No email provided!"} );
	}

    database.getUser(email)
        .then(value => {
			if( value ) {
				if( bcrypt.compareSync(password, value.dataValues.password) ) {
					cb(null,value);
				} else {
					cb(null);
				}
			} else {
				cb(null);
			}
        })
        .catch(error => {
            console.log(error);
            cb(null);
        });
    }
);