const snekfetch = require('snekfetch');

const WebSocket = require('./WebSocket');

const HTTPError = require('./Structures/Error');
const Collection = require('./Structures/Collection');
const Statistics = require('./Structures/Statistics');
const Server = require('./Structures/Server');
const Upvote = require('./Structures/Upvote');
const User = require('./Structures/User');
const Pagination = require('./Structures/Pagination');

const isObject = (obj) => !Array.isArray(obj) && obj === Object(obj);

/**
 * Creates a new client.
 * @class Client
 */
class Client {
	/**
	 * @param {object} options An object with client options.
	 * @param {string} options.id The ID of the server.
	 * @param {string} [options.userToken] The token provided from the user's token page.
	 * @param {string} options.serverToken The token provided from the server's token page.
	 */
	constructor(options) {
		if (!isObject(options)) throw new TypeError('Options must be an object');
		if (typeof options.id !== 'string') throw new TypeError('ID in options object must be a string');
		if ('userToken' in options && typeof options.userToken !== 'string') throw new TypeError('User token in options object must be a string');
		if (typeof options.serverToken !== 'string') throw new TypeError('Server token in options object must be a string');

		this._baseURL = 'https://api.serverlist.space/v1';
		this._options = options;
	}

	/**
	 * Gets basic information about the site.
	 * @memberof Client
	 * @returns {Promise<Statistics|HTTPError>}
	 */
	getStatistics() {
		return new Promise((resolve, reject) => {
			snekfetch
				.get(this._baseURL + '/statistics')
				.then(result => {
					resolve(new Statistics(result.body));
				})
				.catch(error => {
					reject(error, new HTTPError(error));
				});
		});
	}

	/**
	 * Retrieves all servers from the site.
	 * @memberof Client
	 * @param {number} [page=1] The page number.
	 * @returns {Promise<Pagination|HTTPError>}
	 */
	getAllServers(page = 1) {
		if (typeof page !== 'number') throw new TypeError('Page must be a number');
		if (page < 1) throw new SyntaxError('Page must be a number greater than 0.');
		return new Promise((resolve, reject) => {
			snekfetch
				.get(this._baseURL + '/servers')
				.query('page', page)
				.then(result => {
					const pagination = new Pagination(result.body);

					for (let i = 0; i < result.body.servers.length; i++) {
						pagination.set(result.body[i].id, new Server(result.body.servers[i]));
					}

					resolve(pagination);
				})
				.catch(error => {
					reject(new HTTPError(error));
				});
		});
	}

	/**
	 * Retrieves information about a specific server.
	 * @memberof Client
	 * @returns {Promise<Server|HTTPError>}
	 * @param {string} id The ID of the server you want to get information on.
	 */
	getServer(id) {
		if (typeof id !== 'string') throw new TypeError('ID must be a string');
		return new Promise((resolve, reject) => {
			snekfetch
				.get(this._baseURL + '/servers/' + id)
				.then(result => {
					resolve(new Server(result.body));
				})
				.catch(error => {
					reject(new HTTPError(error));
				});
		});
	}

	/**
	 * Gets all upvotes for your server.
	 * @memberof Client
	 * @returns {Promise<Pagination|HTTPError>}
	 * @param {number} [page=1] The page number.
	 */
	getUpvotes(page = 1) {
		if (typeof page !== 'number') throw new TypeError('Page must be a number');
		if (page < 1) throw new SyntaxError('Page must be a number greater than 0.');
		return new Promise((resolve, reject) => {
			snekfetch
				.get(this._baseURL + '/servers/' + this._options.id + '/upvotes')
				.query('page', page)
				.set('Authorization', this._options.serverToken)
				.then(result => {
					const pagination = new Pagination(result.body);

					for (let i = 0; i < result.body.upvotes.length; i++) {
						pagination.set(result.body[i].id, new Upvote(result.body.upvotes[i]));
					}

					resolve(pagination);
				})
				.catch(error => {
					reject(new HTTPError(error));
				});
		});
	}

	/**
	 * Checks if a user has upvoted your server.
     * @memberof Client
	 * @param {string} userID The ID of the user to check for.
	 * @returns {Promise<boolean|HTTPError>}
	 */
	hasUpvoted(userID) {
		if (typeof userID !== 'string') throw new TypeError('User ID must be a string');
		return new Promise((resolve, reject) => {
			this
				.getUpvotes()
				.then((pagination) => {
					resolve(pagination.has(userID));
				})
				.catch(error => {
					reject(error);
				});
		});
	}

	/**
	 * Returns information about the current server.
	 * @returns {Promise<Server|HTTPError>}
	 * @memberof Client
	 */
	getSelfServer() {
		return this.getServer(this._options.id);
	}

	/**
	 * Retrieves information on a specific user.
	 * @memberof Client
	 * @returns {Promise<User|HTTPError>}
	 * @param {string} id The ID of the user you want to get information on.
	 */
	getUser(id) {
		if (typeof id !== 'string') throw new TypeError('User ID is not a string');
		return new Promise((resolve, reject) => {
			snekfetch
				.get(this._baseURL + '/users/' + id)
				.then(result => {
					resolve(new User(result.body));
				})
				.catch(error => {
					reject(new HTTPError(error));
				});
		});
	}

	/**
	 * Retrieves the servers that a user owns.
	 * @memberof Client
	 * @returns {Promise<Pagination|HTTPError>}
	 * @param {string} id The ID of the user you want to get servers on.
	 * @param {number} [page=1] The page number.
	 */
	getUserServers(id, page = 1) {
		if (typeof id !== 'string') throw new TypeError('User ID is not a string');
		if (typeof page !== 'number') throw new TypeError('Page must be a number');
		if (page < 1) throw new SyntaxError('Page must be a number greater than 0.');
		return new Promise((resolve, reject) => {
			snekfetch
				.get(this._baseURL + '/users/' + id + '/servers')
				.query('page', page || '1')
				.then(result => {
					const pagination = new Pagination(result.body);

					for (let i = 0; i < result.body.servers.length; i++) {
						pagination.set(result.body[i].id, new Server(result.body.servers[i]));
					}

					resolve(pagination);
				})
				.catch(error => {
					reject(new HTTPError(error));
				});
		});
	}
}

module.exports = Client;
module.exports.WebSocket = WebSocket;

module.exports.Statistics = Statistics;
module.exports.Server = Server;
module.exports.Collection = Collection;
module.exports.Error = HTTPError;
module.exports.Upvote = Upvote;
module.exports.User = User;
module.exports.Pagination = Pagination;