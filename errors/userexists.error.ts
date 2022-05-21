export default class UserExistsError implements Error {
	name = 'User Exists';
	message = 'The user you\'re trying to create already exists';
}