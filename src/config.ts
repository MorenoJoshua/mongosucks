import Configstore = require("configstore");

const packageJson = require('../package.json');
const config = new Configstore(packageJson.name, {});
const retrieve = key => config.all[key];
const retrieveAll = () => config.all.saved;
const store = (key, val) => config.set(`saved.${key}`, val);
const storeAll = (val) => config.set(`saved`, val);

export default config;

export {
    retrieve,
    retrieveAll,
    store,
    storeAll,
}
