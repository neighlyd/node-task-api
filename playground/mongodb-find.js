const {MongoClient, ObjectID} = require('mongodb');

/*
    Object destructuring is used to pull information out of objects and assign them to variables, like so:

    let user = {name: 'Dustin', age: 36};
    let {name} = user;
    console.log(name);

    This is what we're doing above with {MongoClient}
 */

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // Query all
    // db.collection('Todos').find().toArray().then((docs) => {
    //     console.log('Todos:');
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log(`Unable to fetch todos ${err}`)
    // });

    // Query by a field
    // db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    //     console.log('Todos:');
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log(`Unable to fetch todos ${err}`)
    // });

    // Query by ID
    // db.collection('Todos').find({_id: new ObjectID('5c6b1d67ca6b2155b0d47fa1')})
    //     .toArray()
    //     .then((docs) => {
    //         console.log('Todos:');
    //         console.log(JSON.stringify(docs, undefined, 2))
    //     }, (err) => {
    //         console.log(`Unable to fetch todos ${err}`)
    //     });

    // Count the Todos in collection.
    // db.collection('Todos').find()
    //     .count()
    //     .then((count) => {
    //         console.log(`Todos count: ${count}`);
    //     }, (err) => {
    //         console.log(`Unable to fetch todos ${err}`)
    //     });

    db.collection('Users')
        .find({name: 'Dustin'})
        .toArray()
        .then((docs) => {
            console.log('Users:');
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('Unable to find anyone named Dustin');
        });

    client.close();
});