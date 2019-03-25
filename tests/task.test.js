const request = require('supertest')
const expect = require('expect')
const { ObjectID } = require('mongodb')

const app = require('../src/app')
const Task = require('../src/models/task')
const { tasks, users, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

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

})
