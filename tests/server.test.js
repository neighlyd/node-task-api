const request = require('supertest')
const expect = require('expect')
const { ObjectID } = require('mongodb')

const app = require('../src/app')
const Task = require('../src/models/task')
const User = require('../src/models/user')
const { tasks, populateTasks, users, populateUsers } = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTasks)

describe('POST /tasks', () => {
    it('should create a new task', async () => {
        const token = users[0].tokens[0].token
        const text = 'Test task text'

        const res = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({text})
            .expect(200)
        expect(res.body.text).toBe(text)
        const tasks = await Task.find({text})
        expect(tasks.length).toBe(1)
        expect(tasks[0].text).toBe(text)
    });

    it('should not create a new task with invalid body data', async () => {
        const token = users[0].tokens[0].token

        await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({})
            .expect(400)
        const tasks = await Task.find()
        expect(tasks.length).toBe(4)
    });
});

describe('GET /tasks', () => {
    it('should get all of a user\'s tasks when no query params', async () => {
        const token = users[1].tokens[0].token;

        const res = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.tasks.length).toBe(3)
    });

    it('should filter user\'s tasks by complete with query params', async () => {
        const token = users[1].tokens[0].token

        const res = await request(app)
            .get('/tasks?completed=true')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.tasks.length).toBe(1)
    })

    it('should filter user\'s tasks by incomplete with query params', async () => {
        const token = users[1].tokens[0].token;

        const res = await request(app)
            .get('/tasks?completed=false')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.tasks.length).toBe(2)
    })

    it('should paginate user\'s tasks with query params', async () => {
        const token = users[1].tokens[0].token

        const res = await request(app)
            .get('/tasks?limit=1&skip=1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.tasks.length).toBe(1)
        expect(res.body.tasks[0].text).toBe('Third test task')
    })

    it('should sort user\'s tasks with query params', async () => {
        const token = users[1].tokens[0].token

        const res = await request(app)
            .get('/tasks?sortBy=text:asc')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.tasks.length).toBe(3)
        expect(res.body.tasks[0].text).toBe('Fourth test task')
        expect(res.body.tasks[1].text).toBe('Second test task')
        expect(res.body.tasks[2].text).toBe('Third test task')
    })

    it('should paginate and filter user\'s tasks with query params', async () => {
        const token = users[1].tokens[0].token

        const res = await request(app)
            .get('/tasks?completed=false&sortBy=text:desc&limit=1&skip=1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.tasks.length).toBe(1);
        expect(res.body.tasks[0].text).toBe('Fourth test task')
    })
})

describe('GET /tasks/:id', () => {
   it('should return task doc', async () => {
        const token = users[0].tokens[0].token
        const res = await request(app)
            .get(`/tasks/${tasks[0]._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.task.text).toBe(tasks[0].text)   
   })

   it('should not return task doc created by other user', async () => {
       const token = users[0].tokens[0].token
       await request(app)
            .get(`/tasks/${tasks[1]._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
   })

   it('should return 404 if task not found', async () => {
       const hexID = new ObjectID().toString()
       const token = users[0].tokens[0].token

       await request(app)
            .get(`/tasks/${hexID}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
   })

   it('should return 400 for invalid object id', async () => {
       const hexID = new ObjectID().toString()
       const token = users[0].tokens[0].token

       await request(app)
            .get(`/tasks/${hexID}1`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
   })
})

describe('DELETE /tasks/:id', () => {
   it('should remove a task', async () => {
        const token = users[0].tokens[0].token
        const hexId = tasks[0]._id.toString()

        const res = await request(app)
            .delete(`/tasks/${hexId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.task._id).toBe(hexId);
        const task = await Task.findById(hexId)
        expect(task).toBeFalsy()
   })

   it('should not remove a task from unauthorized user', async () => {
        const token = users[1].tokens[0].token
        const hexId = tasks[0]._id.toString()
        
        await request(app)
            .delete(`/tasks/${hexId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
        const task = await Task.findById(hexId)
        expect(task).toBeTruthy()
   })

   it('should return 404 if task not found', async () => {
        const hexId = new ObjectID()
        const token = users[0].tokens[0].token

        await request(app)
            .delete(`/tasks/${hexId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
   })

   it('should return 400 for invalid object id', async () => {
        const hexID = new ObjectID().toString()
        const token = users[0].tokens[0].token

        await request(app)
            .delete(`/tasks/${hexID}1`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
   })
})

describe('PATCH /tasks/:id', () => {
    it('should update user\'s own task', async () => {
        const id = tasks[0]._id
        const token = users[0].tokens[0].token
        const body = {text: 'Updated first test', completed: true}

        const res = await request(app)
            .patch(`/tasks/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(200)
        expect(res.body.text).toBe(body.text)
        expect(res.body.completed).toBeTruthy
    })

    it('should not let user update task of another user', async () => {
        const id = tasks[0]._id
        const token = users[1].tokens[0].token
        const body = {text: 'Updated first test', completed: true}

        await request(app)
            .patch(`/tasks/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(404)
    })

});

describe('GET /users', () => {
    it('should return user list if authenticated', async () => {
        const user = users[0]
        const token = user.tokens[0].token

        const res = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body.userCount).toBe(4)
        expect(res.body.users.length).toBe(4)
    })

    it('should return 401 if unauthenticated', async () => {
        await request(app)
            .get('/users')
            .expect(401)
    })
})

describe('POST /users', () => {
    it('should create a user', async () => {
        const email = 'example@example.com'
        const password = '1234password'
        const name = 'example'

        const res = await request(app).post('/users').send({name, email, password}).expect(201)
        
        const user = await User.findById(res.body.user._id)
        expect(user).toBeTruthy()
        expect(user.password).not.toBe(password)

        expect(res.body.token).toBeTruthy()
        expect(res.body.user._id).toBeTruthy()
        expect(res.body.user.name).toBe(name)
    })

    it('should not return validation errors if request invalid', async () => {
        const email = 'dustin.com'
        const password = ''

        await request(app).post('/users').send({email, password}).expect(400)
    })

    it('should not create user if email already in database', async () => {
        await request(app).post('/users').send({email: users[0].email, password: 'password123'}).expect(400)
    })
})

describe('GET /users/me', () => {
    it('should return user\'s account', async () => {
        const user = users[0]
        const token = user.tokens[0].token

        const res = await request(app).get('/users/me').set('Authorization', `Bearer ${token}`).expect(200)
        expect(res.body._id).toBe(user._id.toString())
        expect(res.body.name).toBe(user.name)
    })
})

describe('GET /users/:id', () => {
    it('should return own user object', async () => {
        const user = users[0]
        const token = user.tokens[0].token

        const res = await request(app).get(`/users/${user._id.toString()}`).set('Authorization', `Bearer ${token}`).expect(200)
        expect(res.body._id).toBe(user._id.toString())
        expect(res.body.name).toBe(user.name)
    })
    
    it('should return user object if Admin', async () => {
        const user = users[0]
        const admin = users[2]
        const token = admin.tokens[0].token

        const res = await request(app).get(`/users/${user._id.toString()}`).set('Authorization', `Bearer ${token}`).expect(200)
        expect(res.body._id).toBe(user._id.toString())
        expect(res.body.name).toBe(user.name)
    })

    it('should return 400 if incorrect userID requested', async () => {
        const user = users[0]
        const token = user.tokens[0].token

        await request(app).get(`/users/${user._id.toString()}1`).set('Authorization', `Bearer ${token}`).expect(400)
    })

    it('should return 401 if not Admin and not requesting self', async () => {
        const user = users[0]
        const token = user.tokens[0].token
        const hexID = new ObjectID().toString()

        await request(app).get(`/users/${hexID}`).set('Authorization', `Bearer ${token}`).expect(401)
    })
});

describe('PATCH /users/me', () => {
    it('should update user\'s own data with valid input', async () => {
        const user = users[0]
        const token = user.tokens[0].token
        const body = {name: 'Janet'}

        const res = await request(app).patch('/users/me').set('Authorization', `Bearer ${token}`).send(body).expect(200)
        expect(res.body.name).toBe('Janet')
    })

    it('should not update user\'s own data with invalid input', async () => {
        const user = users[0]
        const token = user.tokens[0].token
        const body = {random: 'Janet'}

        await request(app).patch('/users/me').set('Authorization', `Bearer ${token}`).send(body).expect(400)
    })
})

describe('PATCH /users/:id', () => {
    it('should update user\'s own data with valid input', async () => {
        const user = users[0]
        const token = user.tokens[0].token
        const body = {name: 'Janet'}

        const res = await request(app).patch(`/users/${user._id.toString()}`).set('Authorization', `Bearer ${token}`).send(body).expect(200)
        expect(res.body.user.name).toBe('Janet')
    })

    it('should update another user\'s data by Admin with valid input', async () => {
        const user = users[0]
        const admin = users[2]
        const token = admin.tokens[0].token
        const body = {name: 'Janet'}

        const res = await request(app).patch(`/users/${user._id.toString()}`).set('Authorization', `Bearer ${token}`).send(body).expect(200)
        expect(res.body.user.name).toBe('Janet')  
    })

    it('should not update another user\'s data', async () => {
        const user = users[0]
        const user2 = users[1]
        const token = user2.tokens[0].token
        const body = {name: 'Janet'}

        await request(app).patch(`/users/${user._id.toString()}`).set('Authorization', `Bearer ${token}`).send(body).expect(401)
    })

    it('should return 401 with invalid userID', async () => {
        const user = users[0]
        const token = user.tokens[0].token
        const hexID = new ObjectID().toString()

        await request(app).patch(`/users/${hexID}`).set('Authorization', `Bearer ${token}`).expect(401)
    })

    it('should return 400 with invalid body data', async () => {
        const user = users[0]
        const token = user.tokens[0].token
        const body = {random: 'field'}
        
        await request(app).patch(`/users/${user._id.toString()}`).set('Authorization', `Bearer ${token}`).send(body).expect(400)
    })
})

describe('DELETE /users/:id', () => {
    it('should delete user\'s own account', async () => {
        const user = users[0]
        const token = user.tokens[0].token

        const res = await request(app).delete(`/users/${user._id.toString()}`).set('Authorization', `Bearer ${token}`).expect(200)
        expect(res.body._id).toBe(user._id.toString())
        expect(res.body.name).toBe(user.name)
    })

    it('should not delete another user\'s account', async () => {
        const user = users[0]
        const token = user.tokens[0].token
        const user2 = users[1]

        await request(app).delete(`/users/${user2._id.toString()}`).set('Authorization', `Bearer ${token}`).expect(401)
    })

    it('should allow admin to delete user\'s account', async () => {
        const user = users[0]
        const admin = users[2]
        const token = admin.tokens[0].token

        const res = await request(app).delete(`/users/${user._id.toString()}`).set('Authorization', `Bearer ${token}`).expect(200)
        expect(res.body._id).toBe(user._id.toString())
        expect(res.body.name).toBe(user.name)
    })
})

describe('POST /users/login', () => {
    it('should add new token to logged in user', async () => {
        const testUser = users[1]

        const res = await request(app).post('/users/login').send({email: testUser.email, password: testUser.password}).expect(200)
        expect(res.body.token).toBeTruthy()
        expect(res.body.user._id).toBeTruthy()
        expect(res.body.user.name).toBe(testUser.name)
        
        const user = await User.findById(res.body.user._id)
        expect(user.tokens.length).toBe(2)
        expect(user.tokens[0].token).toBe(testUser.tokens[0].token)
        expect(user.tokens[1]).toMatchObject({token: res.body.token})
    })

    it('should create new token for logged out user', async () => {
        const testUser = users[3]

        const res = await request(app).post('/users/login').send({email: testUser.email, password: testUser.password}).expect(200)
        expect(res.body.token).toBeTruthy()
        expect(res.body.user._id).toBeTruthy()
        expect(res.body.user.name).toBe(testUser.name)

        const user = await User.findById(res.body.user._id)
        expect(user.tokens.length).toBe(1)
        expect(user.tokens[0]).toMatchObject({token: res.body.token})
    })


    it('should return 400 on unsuccessful login attempt', async () => {
        const testUser = users[1]

        const res = await request(app).post('/users/login').send({email: testUser.email, password: testUser.password + '1!'}).expect(400)
        expect(res.header['x-auth']).toBeFalsy()
        const user = await User.findById(users[1]._id)
        expect(user.tokens.length).toBe(1)
    })
})

describe('POST /users/logout', () => {
    it('should remove token from user object', async () => {
        const testUser = users[0]
        const token = testUser.tokens[0].token

        await request(app).post('/users/logout').set('Authorization', `Bearer ${token}`).expect(200)
        const user = await User.findById(testUser._id)
        expect(user.tokens.length).toBe(0)
    })
})

describe('POST /users/logoutAll', () => {
    it('should remove all tokens', async () => {
        const testUser = users[0]
        const token = testUser.tokens[0].token

        await request(app).post('/users/logoutAll').set('Authorization', `Bearer ${token}`).expect(200)
        const user = await User.findById(testUser._id)
        expect(user.tokens.length).toBe(0)
    })
})