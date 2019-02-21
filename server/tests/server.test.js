const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 999
}];

beforeEach((done) => {
    // The Udemy course uses db.remove({}), but this is deprecated; so we use db.deleteMany();
    Todo.deleteMany({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';
        request(app)
            .post('/todos')
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
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
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
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
   it('should return todo doc', (done) => {
       request(app)
           .get(`/todos/${todos[0]._id.toHexString()}`)
           .expect(200)
           .expect((res) => {
             expect(res.body.todo.text).toBe(todos[0].text);
           })
           .end(done);
   });

   it('should return 404 if todo not found', (done) => {
       let hexID = new ObjectID().toHexString();
       request(app)
           .get(`/todos/${hexID}`)
           .expect(404)
           .end(done);
   });

   it('should return 400 for invalid object id', (done) => {
       let hexID = new ObjectID().toHexString();
       request(app)
           .get(`/todos/${hexID}1`)
           .expect(400)
           .end(done);
   });
});

describe('DELETE /todos/:id', () => {
   it('should remove a todo', (done) => {
       let hexId = todos[1]._id.toHexString();
       request(app)
           .delete(`/todos/${hexId}`)
           .expect(200)
           .expect((res) => {
               expect(res.body.todo._id).toBe(hexId);
           })
           .end((err, res) => {
               if (err) {
                  return done(err);
               }
               Todo.findById(hexId).then((todo) => {
                   expect(todo).not.toBeTruthy();
                   done();
               }).catch((e) => done(e));
           });
   });

   it('should return 404 if todo not found', (done) => {
       let hexId = new ObjectID();
       request(app)
           .delete(`/todos/${hexId}`)
           .expect(404)
           .end(done);
   });

   it('should return 400 for invalid object id', (done) => {
       let hexID = new ObjectID().toHexString();
       request(app)
           .delete(`/todos/${hexID}1`)
           .expect(400)
           .end(done);
   })
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let id = todos[0]._id;
        let body = {text: 'Updated first test', completed: true};

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[1]._id;
        let body = {text: 'Updated first test', completed: false};

        request(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
    });

});