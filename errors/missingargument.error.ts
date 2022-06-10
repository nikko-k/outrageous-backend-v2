export default class MissingArgumentError implements Error {
	name = 'Missing Argument';
	message = 'This endpoint requires more arguments than provided!';
}