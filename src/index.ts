import {menuFlow} from "./flows";

const clear = require('clear');

const app = async () => {
    clear();
    await menuFlow()
};

app();

