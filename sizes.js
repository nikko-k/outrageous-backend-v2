import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PATH = process.env.UPLOADS_PATH || '/uploads';

const UPLOAD_PATH = __dirname + PATH + path.sep;

export default {
	'thumbnail': {
		width: 300,
		dir:  UPLOAD_PATH + 'thumbnail' + path.sep,
	},
	'large': {
		width: 600,
		dir: UPLOAD_PATH + 'large' + path.sep,
	},
	'full': {
		dir: UPLOAD_PATH + path.sep,
	},
	'default': {
		dir: UPLOAD_PATH + path.sep
	}
}

// TODO
// Make image regeneration service.