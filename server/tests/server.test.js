const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let token = users[0].tokens[0].token;
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new todo with invalid body data', (done) => {
        let token = users[0].tokens[0].token;

        request(app)
            .post('/todos')
            .set('x-auth', token)
            .send({})
            .expect(400)
            .end((err) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all of a user\'s todos', (done) => {
        let token = users[0].tokens[0].token;

        request(app)
            .get('/todos')
            .set('x-auth', token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
   it('should return todo doc', (done) => {
       let token = users[0].tokens[0].token;
       request(app)
           .get(`/todos/${todos[0]._id.toHexString()}`)
           .set('x-auth', token)
           .expect(200)
           .expect((res) => {
             expect(res.body.todo.text).toBe(todos[0].text);
           })
           .end(done);
   });

   it('should not return todo doc created by other user', (done) => {
       let token = users[0].tokens[0].token;

       request(app)
           .get(`/todos/${todos[1]._id.toHexString()}`)
           .set('x-auth', token)
           .expect(404)
           .end(done);
   });

   it('should return 404 if todo not found', (done) => {
       let hexID = new ObjectID().toHexString();
       let token = users[0].tokens[0].token;

       request(app)
           .get(`/todos/${hexID}`)
           .set('x-auth', token)
           .expect(404)
           .end(done);
   });

   it('should return 400 for invalid object id', (done) => {
       let hexID = new ObjectID().toHexString();
       let token = users[0].tokens[0].token;

       request(app)
           .get(`/todos/${hexID}1`)
           .set('x-auth', token)
           .expect(400)
           .end(done);
   });
});

describe('DELETE /todos/:id', () => {
   it('should remove a todo', (done) => {
       let token = users[0].tokens[0].token;
       let hexId = todos[0]._id.toHexString();

       request(app)
           .delete(`/todos/${hexId}`)
           .set('x-auth', token)
           .expect(200)
           .expect((res) => {
               expect(res.body.todo._id).toBe(hexId);
           })
           .end((err, res) => {
               if (err) {
                  return done(err);
               }
               Todo.findById(hexId).then((todo) => {
                   expect(todo).toBeFalsy();
                   done();
               }).catch((e) => done(e));
           });
   });

   it('should not remove a todo from unauthorized user', (done) => {
        let token = users[1].tokens[0].token;
        let hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((e) => done(e));
            });
   });

   it('should return 404 if todo not found', (done) => {
       let hexId = new ObjectID();
       let token = users[0].tokens[0].token;

       request(app)
           .delete(`/todos/${hexId}`)
           .set('x-auth', token)
           .expect(404)
           .end(done);
   });

   it('should return 400 for invalid object id', (done) => {
       let hexID = new ObjectID().toHexString();
       let token = users[0].tokens[0].token;

       request(app)
           .delete(`/todos/${hexID}1`)
           .set('x-auth', token)
           .expect(400)
           .end(done);
   })
});

describe('PATCH /todos/:id', () => {
    it('should update user\'s own todo', (done) => {
        let id = todos[0]._id;
        let token = users[0].tokens[0].token;
        let body = {text: 'Updated first test', completed: true};

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', token)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should not let user update todo of another user', (done) => {
        let id = todos[0]._id;
        let token = users[1].tokens[0].token;
        let body = {text: 'Updated first test', completed: true};

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', token)
            .send(body)
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[1]._id;
        let body = {text: 'Updated first test', completed: false};
        let token = users[1].tokens[0].token;

        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', token)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBeFalsy();
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });

});

describe('GET /users/me', () => {
    it('should return user object if authenticated', (done) => {
       let user = users[0];
       let token = user.tokens[0].token;

       request(app)
           .get('/users/me')
           .set('x-auth', token)
           .expect(200)
           .expect((res) => {
               expect(res.body._id).toBe(user._id.toHexString());
               expect(res.body.email).toBe(user.email);

           })
           .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
       let user = users[1];

       request(app)
           .get('/users/me')
           .expect(401)
           .expect((res) => {
               expect(res.body).toEqual({});
           })
           .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = '1234password';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe('example@example.com');
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not return validation errors if request invalid', (done) => {
        let email = 'dustin.com';
        let password = '';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not create user if email already in database', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'password123'
            })
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should return token on successful login', (done) => {
        let user = users[1];

        request(app)
            .post('/users/login')
            .send({email: user.email, password: user.password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(user.email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(user._id).then((user) => {
                    expect(user.tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });

    });

    it('should return 400 on unsuccessful login attempt', (done) => {
        let user = users[1];
        request(app)
            .post('/users/login')
            .send({email: user.email, password: user.password + '1!'})
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toBeFalsy();
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });

    });
});

describe('DELETE /users/me/token', () => {
   it('should remove token from user object', (done) => {
       let token = users[0].tokens[0].token;

       request(app)
           .delete('/users/me/token')
           .set('x-auth', token)
           .expect(200)
           .end((err) => {
               if (err) {
                   return done(err);
               }
               User.findById(users[0]._id).then((user) => {
                   expect(user.tokens.length).toBe(0);
                   done();
               }).catch((e) => done(e));
           });
   });
});