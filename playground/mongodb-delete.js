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

    // deleteMany - Deletes ALL items matching criteria.
    /*
    db.collection('Todos')
        .deleteMany({text: 'Eat lunch'})
        .then((res) => {
           console.log(res);
        });
    */

    // deleteOne - Deletes the FIRST item matching the criteria.
    /*
    db.collection('Todos')
        .deleteOne({text: 'Eat lunch'})
        .then((res) => {
            console.log(res);
        });
    */

    // findOneAndDelete - deletes the item AND returns its value (c.f. pop())
    /*
    db.collection('Todos')
        .findOneAndDelete({completed: false})
        .then((res) => {
            console.log(res);
        });
    */

    // Challenge - Use deleteMany() and findOneAndDelete() methods to remove users from Users collections in MongoDB.
    //             When using the findOneAndDelete() use the _id field to locate the record.
    /*
    console.log('Challenge One');
    db.collection('Users')
        .deleteMany({name: 'Dustin'})
        .then((res) => {
            console.log(res);
        });
    */

    /*
    console.log('Challenge Two');
    db.collection('Users')
        .findOneAndDelete({_id: new ObjectID('5c6c83641196613c1ed7c28b')})
        .then((res) => {
            console.log(JSON.stringify(res, undefined, 2))
        });
    */

    client.close();
});