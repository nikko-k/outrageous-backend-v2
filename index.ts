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

import LocalStrategy from './passport-strategies/local';
import JWTStrategy from './passport-strategies/jwt';
import FacebookStrategy from './passport-strategies/facebook';

import { userInfo } from 'os';
import { json } from 'stream/consumers';
import Cars from './cars';
import { send } from 'process';

// Database
const database = new Database();

// JWT Secret
const JWTSecret = process.env.JWT_SECRET;

// const checkPass = ( pass:string, inputPass:string):boolean => {
// return await bcrypt.compare(pass, inputPass);
// }


passport.use( 'local', LocalStrategy);
passport.use( 'jwt', JWTStrategy);
passport.use( 'facebook', FacebookStrategy);

passport.serializeUser(function(user, done) {
	done(null, user);
});

// Add error handler middleware
// if (process.env.NODE_ENV === 'development') {
// 	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//   }
  
//   if (process.env.NODE_ENV === 'production') {
// 	app.use(express.errorHandler());
//   }
  

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
const PORT = process.env.PORT || 3000;

const db = new Database();

const cars = new Cars(process.env.CAR_API_KEY, process.env.CAR_API_HOST, process.env.CAR_API_URL );

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

app.use(cors(corsOptions));

app.use(passport.initialize())

app.use(function(req:any,res,next){
	res.locals.currentUser = req.user;
	next();
})

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Test endpoint
app.get('/', (req,res) => {
	res.send(`Serving on port ${PORT}`);
} );

app.get('/car/allmakes',passport.authenticate('jwt') ,(req,res) => {
	cars.getCarMakes()
		.then( value => {
			res.send(value.data)
		})
		.catch( err => {
			res.status(500);
			res.send(err);
		})
})

app.get( '/cars', passport.authenticate('jwt'), (req,res) => {
	const year  = req.query.year || '';
	const make  = req.query.make || '';
	const model = req.query.model || '';

	cars.getFilteredCars(year,make,model)
		.then( value => {
			res.send(value.data)
		})
		.catch( err => {
			res.status(500);
			res.send(err);
		})
	
})

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

	db.registerUser(user.email,user.firstname, user.password)
		.then(value => {
			res.status(200);
			res.send(JWT.sign( value, JWTSecret));
		})
		.catch(error => {
			res.status(401);
			res.send(error.message);
		});
});

app.post( '/login',
	passport.authenticate( 'local', { session: false, failureMessage: true } ),
	function(req:any,res) {
		res.send(JWT.sign( req.user.dataValues.id, JWTSecret));
	}
);

app.post(
	'/logout',
	(req:any,res) => {
		req.logout();
		res.send(200);
	}
)

app.get('/login/facebook', passport.authenticate('facebook', {
	scope: [ 'email', 'user_location' ]
}));

app.get('auth/facebook/callback', passport.authenticate( 'facebook'), (req:any,res) => {
	res.json(req.user);
})

app.post('/auth/check', (req:any,res) => {
	const token = req.body.token;
	if( ! token ) {
		res.sendStatus(401);
	}

	try {
		const content = JWT.verify(token, JWTSecret);

		if( content ) {
			res.send(content);
		}
	} catch( error ) {
		res.sendStatus(401);
	}
})

app.get('/garage', (req,res) => {
	const garageID = req.query.garageid;

	database.getGaragebyID(garageID)
		.then( value => {
			if(! value) {
				res.sendStatus(404);
			} else {
				res.send(value);
			}
		})
		.catch( error => {
			res.status(500)
			res.send(error);
		});
});

app.get('/user', passport.authenticate('jwt') , (req:any,res) => {
	let userID:any = req.user.dataValues.id;

	if(! userID) {
		userID = req.user.dataValues.id;
	}

	database.getUserbyID(userID)
		.then( value => {
			if(! value) {
				res.sendStatus(404);
			} else {
				res.send(value);
			}
		})
		.catch( error => {
			res.status(500)
			res.send(error);
		});
});

app.get('/mygarage', passport.authenticate('jwt') ,(req:any,res) => {
	const userID = req.user.getDataValue('id');

	if(!userID) {
		res.send(401)
	}

	database.getGarageByUser(userID)
	.then(value => {
		res.send(value);
	})
	.catch(err => {
		res.send(404);
	})
});

app.get('/car',(req:any,res) => {
	const carID = req.query.carid;

	database.getCarByID(carID)
})

app.post('/addcarpic', (req:any,res) => {

});

app.post('/create/car', passport.authenticate('jwt'), (req:any,res) => {
	const car = req.body;
	const userID = req.user.getDataValue('id');
	if(!car || !userID) {
		res.send(403);
	}

	database.createCar(car,userID)
		.then(value => {
			console.log(value);
			res.sendStatus(200);
		})
		.catch((error) =>{
			console.log(error);
			res.sendStatus(500);
		})
});

app.listen(PORT , () => {
	console.log(`listening on port ${PORT}`);
	console.log(`environment: ${process.env.NODE_ENV}`);
});

export default app;
