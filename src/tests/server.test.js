const request = require('supertest')
const expect = require('expect')
const { ObjectID } = require('mongodb')

const app = require('../index')
const Task = require('../models/task')
const User = require('../models/user')
const { tasks, populateTasks, users, populateUsers } = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTasks);

describe('POST /tasks', () => {
    it('should create a new task', (done) => {
        let token = users[0].tokens[0].token;
        let text = 'Test task text';

        request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Task.find({text}).then((tasks) => {
                    expect(tasks.length).toBe(1);
                    expect(tasks[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a new task with invalid body data', (done) => {
        let token = users[0].tokens[0].token;

        request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({})
            .expect(400)
            .end((err) => {
                if (err) {
                    return done(err);
                }
                Task.find().then((tasks) => {
                    expect(tasks.length).toBe(4);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /tasks', () => {
    it('should get all of a user\'s tasks when no query params', (done) => {
        let token = users[1].tokens[0].token;

        request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.tasks.length).toBe(3);
            })
            .end(done);
    });

    it('should filter user\'s tasks by complete with query params', (done) => {
        let token = users[1].tokens[0].token;

        request(app)
            .get('/tasks?completed=true')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.tasks.length).toBe(1);
            })
            .end(done);
    })

    it('should filter user\'s tasks by incomplete with query params', (done) => {
        let token = users[1].tokens[0].token;

        request(app)
            .get('/tasks?completed=false')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.tasks.length).toBe(2);
            })
            .end(done);
    })

    it('should paginate user\'s tasks with query params', (done) => {
        let token = users[1].tokens[0].token;

        request(app)
            .get('/tasks?limit=1&skip=1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.tasks.length).toBe(1);
                expect(res.body.tasks[0].text).toBe('Third test task')
            })
            .end(done);
    })

    it('should sort user\'s tasks with query params', (done) => {
        let token = users[1].tokens[0].token;

        request(app)
            .get('/tasks?sortBy=text:asc')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.tasks.length).toBe(3);
                expect(res.body.tasks[0].text).toBe('Fourth test task')
                expect(res.body.tasks[1].text).toBe('Second test task')
                expect(res.body.tasks[2].text).toBe('Third test task')
            })
            .end(done);
    })

    it('should paginate and filter user\'s tasks with query params', (done) => {
        let token = users[1].tokens[0].token;

        request(app)
            .get('/tasks?completed=false&sortBy=text:desc&limit=1&skip=1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.tasks.length).toBe(1);
                expect(res.body.tasks[0].text).toBe('Fourth test task')
            })
            .end(done);
    })
});

describe('GET /tasks/:id', () => {
   it('should return task doc', (done) => {
       let token = users[0].tokens[0].token;
       request(app)
           .get(`/tasks/${tasks[0]._id.toString()}`)
           .set('Authorization', `Bearer ${token}`)
           .expect(200)
           .expect((res) => {
             expect(res.body.task.text).toBe(tasks[0].text);
           })
           .end(done);
   });

   it('should not return task doc created by other user', (done) => {
       let token = users[0].tokens[0].token;

       request(app)
           .get(`/tasks/${tasks[1]._id.toString()}`)
           .set('Authorization', `Bearer ${token}`)
           .expect(404)
           .end(done);
   });

   it('should return 404 if task not found', (done) => {
       let hexID = new ObjectID().toString();
       let token = users[0].tokens[0].token;

       request(app)
           .get(`/tasks/${hexID}`)
           .set('Authorization', `Bearer ${token}`)
           .expect(404)
           .end(done);
   });

   it('should return 400 for invalid object id', (done) => {
       let hexID = new ObjectID().toString();
       let token = users[0].tokens[0].token;

       request(app)
           .get(`/tasks/${hexID}1`)
           .set('Authorization', `Bearer ${token}`)
           .expect(400)
           .end(done);
   });
});

describe('DELETE /tasks/:id', () => {
   it('should remove a task', (done) => {
       let token = users[0].tokens[0].token;
       let hexId = tasks[0]._id.toString();

       request(app)
           .delete(`/tasks/${hexId}`)
           .set('Authorization', `Bearer ${token}`)
           .expect(200)
           .expect((res) => {
               expect(res.body.task._id).toBe(hexId);
           })
           .end((err, res) => {
               if (err) {
                  return done(err);
               }
               Task.findById(hexId).then((task) => {
                   expect(task).toBeFalsy();
                   done();
               }).catch((e) => done(e));
           });
   });

   it('should not remove a task from unauthorized user', (done) => {
        let token = users[1].tokens[0].token;
        let hexId = tasks[0]._id.toString();

        request(app)
            .delete(`/tasks/${hexId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Task.findById(hexId).then((task) => {
                    expect(task).toBeTruthy();
                    done();
                }).catch((e) => done(e));
            });
   });

   it('should return 404 if task not found', (done) => {
       let hexId = new ObjectID();
       let token = users[0].tokens[0].token;

       request(app)
           .delete(`/tasks/${hexId}`)
           .set('Authorization', `Bearer ${token}`)
           .expect(404)
           .end(done);
   });

   it('should return 400 for invalid object id', (done) => {
       let hexID = new ObjectID().toString();
       let token = users[0].tokens[0].token;

       request(app)
           .delete(`/tasks/${hexID}1`)
           .set('Authorization', `Bearer ${token}`)
           .expect(400)
           .end(done);
   })
});

describe('PATCH /tasks/:id', () => {
    it('should update user\'s own task', (done) => {
        let id = tasks[0]._id;
        let token = users[0].tokens[0].token;
        let body = {text: 'Updated first test', completed: true};

        request(app)
            .patch(`/tasks/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(body.text);
                expect(res.body.completed).toBeTruthy;
            })
            .end(done);
    });

    it('should not let user update task of another user', (done) => {
        let id = tasks[0]._id;
        let token = users[1].tokens[0].token;
        let body = {text: 'Updated first test', completed: true};

        request(app)
            .patch(`/tasks/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(404)
            .end(done);
    });

});

describe('GET /users', () => {
    it('should return user list if authenticated', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;

        request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.userCount).toBe(3);
                expect(res.body.users.length).toBe(3);
            })
            .end(done);
    });

    it('should return 401 if unauthenticated', (done) => {
        request(app)
            .get('/users')
            .expect(401)
            .end(done);
    });
})

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = '1234password';
        let name = 'example';

        request(app)
            .post('/users')
            .send({name, email, password})
            .expect(201)
            .expect((res) => {
                expect(res.body.token).toBeTruthy()
                expect(res.body.user._id).toBeTruthy()
                expect(res.body.user.name).toBe(name)
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

describe('GET /users/me', () => {
    it('should return user\'s account', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;

        request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(user._id.toString());
                expect(res.body.name).toBe(user.name);
            })
            .end(done);
    })
});

describe('GET /users/:id', () => {
    it('should return own user object', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;

        request(app)
            .get(`/users/${user._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(user._id.toString());
                expect(res.body.name).toBe(user.name);
            })
            .end(done);
    });

    it('should return user object if Admin', (done) => {
        let user = users[0]
        let admin = users[2]
        let token = admin.tokens[0].token;

        request(app)
            .get(`/users/${user._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(user._id.toString());
                expect(res.body.name).toBe(user.name);
            })
            .end(done);
    });

    it('should return 400 if incorrect userID requested', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;

        request(app)
            .get(`/users/${user._id.toString()}1`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .end(done);
    })

    it('should return 401 if not Admin and not requesting self', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;
        let hexID = new ObjectID().toString();

        request(app)
            .get(`/users/${hexID}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .end(done);
    })
});

describe('PATCH /users/me', () => {
    it('should update user\'s own data with valid input', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;
        let body = {name: 'Janet'}

        request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe('Janet')
            })
            .end(done);
    });

    it('should not update user\'s own data with invalid input', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;
        let body = {random: 'Janet'}

        request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(400)
            .end(done);
    });
})

describe('PATCH /users/:id', () => {
    it('should update user\'s own data with valid input', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;
        let body = {name: 'Janet'}

        request(app)
            .patch(`/users/${user._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.name).toBe('Janet')
            })
            .end(done);
    });

    it('should update another user\'s data by Admin with valid input', (done) => {
        let user = users[0];
        let admin = users[2]
        let token = admin.tokens[0].token;
        let body = {name: 'Janet'}

        request(app)
            .patch(`/users/${user._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.user.name).toBe('Janet')
            })
            .end(done);
    });

    it('should not update another user\'s data', (done) => {
        let user = users[0];
        let user2 = users[1]
        let token = user2.tokens[0].token;
        let body = {name: 'Janet'}

        request(app)
            .patch(`/users/${user._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(401)
            .end(done);
    });

    it('should return 401 with invalid userID', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;
        let hexID = new ObjectID().toString();

        request(app)
            .patch(`/users/${hexID}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .end(done);
    });

    it('should return 400 with invalid body data', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;
        let body = {random: 'field'}
        
        request(app)
            .patch(`/users/${user._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(400)
            .end(done);
    });
});

describe('DELETE /users/:id', () => {
    it('should delete user\'s own account', (done) => {
        let user = users[0];
        let token = user.tokens[0].token;

        request(app)
            .delete(`/users/${user._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(user._id.toString());
                expect(res.body.name).toBe(user.name);
            })
            .end((done))
    });

    it('should not delete another user\'s account', (done) => {
        let user = users[0]
        let token = user.tokens[0].token
        let user2 = users[1]

        request(app)
            .delete(`/users/${user2._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .end(done);
    })

    it('should allow admin to delete user\'s account', (done) => {
        let user = users[0]
        let admin = users[2]
        let token = admin.tokens[0].token

        request(app)
        .delete(`/users/${user._id.toString()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(user._id.toString());
            expect(res.body.name).toBe(user.name);
        })
        .end(done);
    })
});

describe('POST /users/login', () => {
    it('should return token on successful login', (done) => {
        let user = users[1];

        request(app)
            .post('/users/login')
            .send({email: user.email, password: user.password})
            .expect(200)
            .expect((res) => {
                expect(res.body.token).toBeTruthy();
                expect(res.body.user._id).toBeTruthy();
                expect(res.body.user.name).toBe(user.name);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                User.findById(user._id).then((user) => {
                    expect(user.tokens[1]).toMatchObject({
                        token: res.body.token
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

describe('POST /users/logout', () => {
    it('should remove token from user object', (done) => {
        let user = users[0]
        let token = user.tokens[0].token

        request(app)
            .post('/users/logout')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.findById(user._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('POST /users/logoutAll', () => {
    it('should remove all tokens', (done) => {
        let user = users[0]
        let token = user.tokens[0].token

        request(app)
            .post('/users/logoutAll')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err) => {
                if (err) {
                    return done(err)
                }
                User.findById(user._id).then((user) => {
                    expect(user.tokens.length).toBe(0)
                    done()
                }).catch((e) => done(e))
            })        
    })
})