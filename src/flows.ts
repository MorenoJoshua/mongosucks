import * as fs from "fs";
import * as inquirer from "inquirer";
import {query} from "./mongo";
import {retrieve, retrieveAll, storeAll} from "./config";

const clear = require('clear');

// TODO: configs should be related to db/collection combo
// TODO: should be able to store more than one config
// TODO: should be able to add aliases and notes to configs
// TODO: add srv manager

// TODO: should be a query manager, query/dump and count should be two different query modes ??

const configFlow = async () => {
    const configQuestions = () => [ // TODO: separate into flow
        {type: "input", message: "srv", name: "srv"},
        {type: "input", message: "collection", name: "collection"},
        {type: "input", message: "startAt", name: "startAt", placeholder: "YYYY-MM-DD"},
        {type: "input", message: "startKey", name: "startKey", placeholder: "created"},
        {type: "input", message: "db", name: "db"},
        {type: "input", message: "file", name: "file"},
        {type: "input", message: "project", name: "project"},
        {type: "list", message: "Count?", name: "count", choices: [0, 1]}
    ].map(q => { // adds pre-saved values as default
        const def = retrieve(q.name);
        return ({
            ...q,
            ...def ? {default: def} : {}
        });
    });

    const responses = await inquirer.prompt(configQuestions());
    await storeAll(responses);
    return responses;
};

const menuFlow = async () => {
    clear();
    const res = await inquirer.prompt([
        {
            type: 'list', message: "Watchawannado?", name: "menuChoice", choices: [
                {value: 'config', name: "Configure"},
                {value: 'dump', name: "Dump"},
                {value: 'close', name: "Close"},
            ]
        }
    ]);
    clear();

    switch (res.menuChoice) {

        case "close":
            break;

        case "dump":
            const results = await query({
                ...retrieveAll(),
            });
            await fs.writeFileSync(`dumps/${retrieve("file") || "dump"}.json`, JSON.stringify(results));
            return await menuFlow();

        case "config":
            await configFlow();
            return await menuFlow();

    }

    clear();
    return;

};

export {
    configFlow,
    menuFlow,
}
