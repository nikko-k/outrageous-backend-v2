import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const PATH = process.env.UPLOADS_PATH || '/uploads';
const THUMBNAIL_SUBDIR = 'thumbnail' + path.sep;
const LARGE_SUBDIR = 'large' + path.sep;

const UPLOAD_PATH = __dirname + PATH + path.sep;

export default {
	'thumbnail': {
		width: 300,
		dir:  UPLOAD_PATH + THUMBNAIL_SUBDIR,
	},
	'large': {
		width: 600,
		dir: UPLOAD_PATH + LARGE_SUBDIR,
	},
	'full': {
		dir: UPLOAD_PATH,
	},
	'default': {
		dir: UPLOAD_PATH
	}
}