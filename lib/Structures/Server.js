const Collection = require('./Collection');
const User = require('./User');

/**
 * A class which represents a server that is listed on the site.
 * @constructor
 */
class Server {
	/**
	 * @param {object} server Contains the server information returned raw from the site.
	 * @property {string} id The ID of the server.
	 * @property {string} name The name of the server.
	 * @property {string} shortDescription A short description of the purpose of the server.
	 * @property {string} fullDescription A detailed description of the server. Contains Markdown, may be blank.
	 * @property {string} iconURL The URL for the avatar of the server. Not guaranteed to be available from Discord.
	 * @property {boolean} iconChildFriendly A boolean stating if the avatar should be considered child friendly.
	 * @property {Collection<string, User>} owners A collection of User classes which hold listed owner's information.
	 * @property {?string} vanity A string containing the vanity of the server. May be null.
	 * @property {object} links An object that contains links.
	 * @property {number} createdAt A timestamp in milliseconds since the server was added to the site.
	 * @property {number} updatedAt A timestamp in milliseconds since the server was last updated.
	 * @memberof Server
	 */
	constructor(server) {
		this.id = server.id;
		this.username = server.username;
		this.discriminator = server.discriminator;
		this.shortDescription = server.short_description;
		this.fullDescription = server.full_description;
		this.iconURL = server.icon;
		this.iconChildFriendly = server.icon_child_friendly;
		this.owners = new Collection();
		for (let i = 0; i < server.owners.length; i++) {
			this.owners.set(server.owners[i].id, new User(server.owners[i]));
		}
		this.vanity = server.vanity;
		this.links = server.links;
		this.createdAt = server.created_at;
		this.updatedAt = server.updated_at;
	}

	/**
	 * Returns an absolute path to view the server on the site.
	 * @returns {string} The ID of the server.
	 * @memberof Server
	 */
	getURL() {
		return 'https://serverlist.space/server/' + this.getID();
	}

	/**
	 * Gets the ID of the server.
	 * @returns {string}
	 * @memberof Server
	 */
	getID() {
		return this.id;
	}

	/**
	 * Gets the name of the server.
	 * @returns {string} The name of the server.
	 * @memberof Server
	 */
	getName() {
		return this.name;
	}

	/**
	 * Gets the short description of the purpose of the server.
	 * @returns {string} A short description of the purpose of the server.
	 * @memberof Server
	 */
	getShortDescription() {
		return this.shortDescription;
	}

	/**
	 * Gets the detailed description of the server. Contains Markdown, may be blank.
	 * @returns {string} A detailed description of the server. Contains Markdown, may be blank.
	 * @memberof Server
	 */
	getFullDescription() {
		return this.fullDescription;
	}

	/**
	 * Gets the URL for the avatar of the server. Not guaranteed to be available from Discord.
	 * @returns {string} The URL for the avatar of the server. Not guaranteed to be available from Discord.
	 * @memberof Server
	 */
	getIconURL() {
		return this.iconURL;
	}

	/**
	 * Gets the collection of User classes which hold listed owner's information.
	 * @returns {Collection<User>} A collection of User classes which hold listed owner's information.
	 * @memberof Server
	 */
	getOwners() {
		return this.owners;
	}

	/**
	 * Gets the string containing the vanity of the server. May be null.
	 * @returns {?string} A string containing the vanity of the server. May be null.
	 * @memberof Server
	 */
	getVanity() {
		return this.vanity;
	}

	/**
	 * Gets the boolean stating if the icon is not considered child friendly.
	 * @returns {boolean} A boolean stating if the icon is not considered child friendly.
	 * @memberof Server
	 */
	isNSFW() {
		return !this.iconChildFriendly;
	}

	/**
	 * Gets an object that contains links.
	 * @returns {object} An object that contains links.
	 * @memberof Server
	 */
	getLinks() {
		return this.links;
	}

	/**
	 * Gets the date since the server was added to the site.
	 * @returns {Date} A date since the server was added to the site.
	 * @memberof Server
	 */
	getCreatedAt() {
		return new Date(this.createdAt);
	}

	/**
	 * Gets the date since the server was last updated.
	 * @returns {Date} A date since the server was last updated.
	 * @memberof Server
	 */
	getUpdatedAt() {
		return new Date(this.updatedAt);
	}
}

module.exports = Server;