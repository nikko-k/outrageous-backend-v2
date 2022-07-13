import express from 'express';
import fileUpload from 'express-fileupload';
import cors	from 'cors';
import Database from './database';
import shortid from 'shortid';
import fs from 'fs';
import path from 'path';
import passport from 'passport';
import JWTStrategy from './passport-strategies/jwt';
import JWT from 'jsonwebtoken';
import { userInfo } from 'os';

const app = express();
const PORT = process.env.UPLOADS_PORT || 3000;
const PATH = process.env.UPLOADS_PATH || '/uploads';
const JWT_SECRET = process.env.JWT_SECRET || '';

const UPLOAD_PATH = __dirname + PATH + path.sep;
console.log(UPLOAD_PATH);

const db = new Database();

const getToken = (req) => {
	if( ! req.headers.authorization ) {
		return false;
	}

	try {
		return req.headers.authorization.split(' ')[1];
	}
	catch {
		return false;
	}
}

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

app.use(passport.initialize());
app.use(cors(corsOptions));

passport.use('jwt', JWTStrategy);

// Setup file upload options
app.use(fileUpload({
	limits: { fileSize: 50 * 1024 * 1024 },
  }));

app.post( '/upload', (req:any, res) => {
	let userID = null;
	const token = getToken(req);
	if( token ) {
		userID = JWT.verify(token, JWT_SECRET);
	}

	const file = req.files.file;
	if( ! file ) {
		res.statusCode = 400;
		res.json(
			{
				type: 'error',
				message: 'Missing file'
			}
		)
		res.send();
	}

	const newFilename = `${shortid.generate()}-${file.name}`;

	file.isPicture = file.mimetype.includes('image');
	file.newName = newFilename;
	file.path = UPLOAD_PATH + newFilename;
	file.userID = userID;

	file.mv( file.path, (err) => {
		if(err) {
			res.statusCode = 500;
			res.json(
				{
					type: 'error',
					message: 'Server error'
				}
			)
			res.send();
		}
		const upload = db.addFile(file);

		upload
		.then( (value) => {
			res.json({
				type: 'success',
				fileID: value.dataValues.id
			})
		})
	} )
})

app.get('/file/:id', (req,res) => {
	const id = req.params.id;
	if(!id) {
		res.statusCode = 400;
			res.json(
				{
					type: 'error',
					message: 'Missing file ID'
				}
			)
			res.send();
	}

	db.getFile(id)
	.then( value => {
		if(!value) {
			res.statusCode = 404;
			res.json(
				{
					type: 'error',
					message: 'File not found'
				}
			)
			res.send();
		}

		const filepath = value.dataValues.filepath;
		res.download(filepath);
	})
	.catch(err => {
		res.statusCode = 500;
			res.json(
				{
					type: 'error',
					message: 'Server Error'
				}
			)
			res.send();
	})
});

app.listen(PORT, () => {
	console.log(`Listening on ${PORT}`)
	if (!fs.existsSync(UPLOAD_PATH)){
		fs.mkdirSync(UPLOAD_PATH);
	}
});
