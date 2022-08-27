import Database from '../database';
import {Strategy, ExtractJwt} from 'passport-jwt'

const database = new Database();

var opts:any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

export default new Strategy(
	opts,
	function (jwtPayload, cb) {

	//find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.

	return database.getUserbyID(jwtPayload)
		.then(user => {
			return cb(null, user);
		})
		.catch(err => {
			return cb(err);
		});
}
)