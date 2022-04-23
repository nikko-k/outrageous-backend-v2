import express from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {validationResult, body} from 'express-validator';
import passport from 'passport';
import { Sequelize } from 'sequelize/types';
import Database from './database';
import session from 'express-session'
import { errorMonitor } from 'events';
import cors	from 'cors';

// import localStrategy from './passport-strategies/local';
import LocalStrategy from './passport-strategies/local';
import JWTStrategy from './passport-strategies/jwt';
import { userInfo } from 'os';

// Database
const database = new Database;

// JWT Secret
const JWTSecret = process.env.JWT_SECRET;

// const checkPass = ( pass:string, inputPass:string):boolean => {
// return await bcrypt.compare(pass, inputPass);
// }


passport.use( 'local', LocalStrategy);
passport.use( 'jwt', JWTStrategy);

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(email, done) {
	db.getUser(email)
	.then( (value) => {
		done(null,value.dataValues.email)
	})
	.catch( err => {
			console.log(err)
		}
	)
});

dotenv.config();
const PORT = process.env.PORT;

const db = new Database();

// Init express
const app = express();

const corsOptions = {
	//To allow requests from client
	origin: [
	  "http://localhost:3001",
	  "http://127.0.0.1",
	  "http://104.142.122.231",
	],
	credentials: true,
	exposedHeaders: ["set-cookie"],
  };

app.use("/", cors(corsOptions));

app.use(session({secret: "secret"}));

app.use(passport.initialize())
app.use(passport.session())

app.use(function(req:any,res,next){
	res.locals.currentUser = req.user;
	next();
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Test endpoint
app.get('/', (req,res) =>{
	res.send(`Serving on port ${PORT}`);
} );

// Register endpoint
app.post('/register',body('password').isLength({min:5,max:30}),body('firstname').notEmpty(), body('email').isEmail() , (req,res) => {

	let user:any = {};

	user.password = bcrypt.hashSync(req.body.password, 10);
	user.firstname = req.body.firstname;
	user.email = req.body.email;

	const validationErrors = validationResult(req);
	if(! validationErrors.isEmpty()) {
		res.status(401);
		res.send(validationErrors)
		return;
	}
	const result = db.registerUser(user.email,user.firstname, user.password);

	result
	.then((value) => {
		const newRecord:boolean = value[0]._options.isNewRecord;
		if(newRecord){
			console.log('User Created successfully');
			res.sendStatus(200);
		} else {
			console.log('User already exists');
			res.send(401)
		}
	})
	.catch((error) => {
		console.log('Failed');
		console.log(error)
		res.sendStatus(401);
	});
});

app.post( '/login',
	passport.authenticate( 'local', { session: false, failureMessage: true } ),
	function(req:any,res) {
		res.json({
			token: JWT.sign( req.user.dataValues.id, JWTSecret),
			user: req.user.dataValues,
		} );
	}
);

app.post(
	'/logout',
	(req:any,res) => {
		req.logout();
		res.send(200);
	}
)

app.get('/auth/check', (req:any,res) => {
	db.getUser(req.user)
	.then( value => {
		if( ! value || Object.keys(value).length <= 0 ) {
			res.sendStatus(401)
		} else {
			res.sendStatus(200);
		}
	})
	.catch( (error) => {
		res.sendStatus(401);
	})
})

app.post('/auth/check', (req:any,res) => {
	db.getUser(req.user)
	.then( value => {
		if( ! value || Object.keys(value).length <= 0 ) {
			res.sendStatus(401)
		} else {
			res.sendStatus(200);
		}
	})
	.catch( (error) => {
		res.sendStatus(401);
	})
})

app.listen(PORT , () => {
	console.log(`listening on port ${PORT}`);
});