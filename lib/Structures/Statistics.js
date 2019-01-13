/**
 * Contains basic statistics of the site, including server and user count.
 * @constructor
 */
class Statistics {
	/**
	 * @param {Object} result The raw result returned from the API.
	 * @property {number} servers The number of total servers listed on the site.
	 * @property {number} tags The number of tags available for use.
	 * @property {number} users The number of users logged into the site.
	 * @memberof Statistics
	 */
	constructor(result) {
		this.servers = result.servers;
		this.tags = result.tags;
		this.users = result.users;
	}

	/**
	 * Gets the number of total servers listed on the site.
	 * @returns {number} The number of total servers listed on the site.
	 * @memberof Statistics
	 */
	getServers() {
		return this.servers;
	}

	/**
	 * Gets the number of tags available for use.
	 * @returns {number} The number of available tags for use.
	 * @memberof Statistics
	 */
	getTags() {
		return this.tags;
	}

	/**
	 * Gets the number of users logged into the site.
	 * @returns {number} The number of users logged into the site.
	 * @memberof Statistics
	 */
	getUsers() {
		return this.users;
	}
}

module.exports = Statistics;