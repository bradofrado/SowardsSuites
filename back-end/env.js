//Get the environment variables
const mongoConnection = process.env.MONGO_KEY;
const root = process.env.ROOT;
const port = process.env.SERVER_PORT;

module.exports = {
    mongoConnection: mongoConnection,
    root: root,
    port: port,
    smtp_key: process.env.SMTP_KEY,
    isDevelopment: process.env.NODE_ENV === 'development',
	site: process.env.SITE
}