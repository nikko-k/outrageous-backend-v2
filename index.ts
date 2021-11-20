import express from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import {validationResult, body, sanitizeBody} from 'express-validator';


// Dotenv configuration
dotenv.config();
const PORT = process.env.PORT;

// Init express
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Test endpoint
app.get('/', (req,res) =>{
	res.send('Here');
} );

// Register endpoint
app.post('/register',body('password').isLength({min:5,max:30}), body('email').isEmail() , (req,res) => {

	let user:any = {};

	user.password = bcrypt.hashSync(req.body.password, 10);
	user.email = req.body.email;
	
	const validationErrors = validationResult(req);
	if(! validationErrors.isEmpty()) {
		res.status(401);
		res.send({
			status: 'Missing Data',
			message: validationErrors,
		})
		return;
	}


});

app.post('/login', (req,res) => {
	const email = req.body.email;
});

app.listen(PORT , () => {
	console.log(`listening on port ${PORT}`);
});