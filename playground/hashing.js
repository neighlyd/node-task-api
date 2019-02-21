const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';
// let salt = bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         // store hash in DB or call err
//         console.log(hash)
//     })
// });

let hashedPW = '$2a$10$a6md0J5TLWZSQ9ZdQ.iBQ.GqMEPvhhE654sOb77OS/PRaQd7T.1he';

bcrypt.compare(password, hashedPW, (err, res) => {
    console.log(res);
});

// let data = {
//     id: 9
// };
//
// let token = jwt.sign(data, '123abc');
// console.log(token);
//
// let decoded = jwt.verify(token, '123abcc');
// console.log('decoded', decoded);


// This is the concepts behind the JWT.
/*
let message = 'I am user number 9';
let hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data = {
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();

let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
    console.log('Data was not changed.')
} else {
    console.log('Data was changed. Do not trust!')
}
*/
