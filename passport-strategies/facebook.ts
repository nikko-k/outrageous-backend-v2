import Database from '../database';
import FacebookStrategy from 'passport-facebook'
import dotenv from 'dotenv'

const FACEBOOK_APP_SECRET = process.env.FACEBOOK_SECRET;
const FACEBOOK_APP_ID = process.env.FACEBOOK_ID;

const database = new Database();

export default new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3030/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    database.getUserbyFacebookID(profile.id)
	.then( (user) => cb(null, user) )
	.catch( (err) => cb(err, null ) );
	}
);