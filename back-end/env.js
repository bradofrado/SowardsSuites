//Get the environment variables
require('dotenv').config({ path: '../.env' });

const mongoConnection = process.env.MONGO_KEY || "mongodb+srv://bradofrado:%23Kylie5789@mycluster.yq8un.mongodb.net/sowardssuites";
const root = process.env.ROOT || 'C:\\Users\\brado\\Documents\\BYU\\CS260\\SowardsSuites\\front-end\\public';
const port = process.env.SERVER_PORT || 3000;

module.exports = {
    mongoConnection: mongoConnection,
    root: root,
    port: port
}