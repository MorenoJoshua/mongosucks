import {MongoClient} from "mongodb";
import * as chalk from "chalk";

// TODO: project and remove should combine
const query = async ({srv, collection, project, find, count, startAt, startKey, db}) => {
    let toReturn: any | false = false;
    const mongo = new MongoClient(srv, {
        useUnifiedTopology: true,
    });

    const connected = await new Promise((resolve, reject) => {
        mongo.connect(err => {
            if (err === null) resolve(true);
            reject(err);
            return
        });
    });

    if (connected) {
        const mdb = mongo.db(db);
        if (mdb) {
            const collections = await mdb.collections();
            const collectionNames = collections.map(c => c.collectionName);
            if (collectionNames.indexOf(collection) !== -1) {
                let query = await mdb.collection(collection).find({
                    ...find ? find : {},
                    ...startAt && startKey ? {
                        [startKey]: {$gt: new Date(startAt)}
                    } : {},
                });

                if (project && project !== '') {
                    query = query.project(project.split(",").reduce((a, c) => ({...a, [c]: 1}), {}));
                }

                toReturn = count == 1 ? await query.count() : await query.toArray();


            } else {
                console.log(chalk.red("Collection does not exist"));
                console.log(chalk.blue(collectionNames));
            }
        } else
            console.log(chalk.red("No mdb"));
    } else
        console.log(chalk.red("Not connected"));

    await mongo.close();
    return toReturn;

};

export {
    query,
}
