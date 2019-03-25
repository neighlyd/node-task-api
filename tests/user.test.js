const request = require('supertest')
const expect = require('expect')
const { ObjectID } = require('mongodb')

const app = require('../src/app')
const User = require('../src/models/user')
const { users, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

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

        const res = await request(app)
            .delete(`/users/${user._id.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(res.body._id).toBe(user._id.toString())
        expect(res.body.name).toBe(user.name)
    })
})

describe('POST /users/me/avatar', () => {
    it('should upload user\'s profile pic', async () => {
        const testUser = users[0]

        await request(app)
            .post('/users/me/avatar')
            .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)
        const user = await User.findOne({email: testUser.email})
        expect(user.avatar).toEqual(expect.any(Buffer))
    })
})

describe('DELETE /users/me/avatar', () => {
    it('should delete user\'s profile pic', async () => {
        const testUser = users[0]

        await request(app)
            .delete('/users/me/avatar')
            .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
            .expect(200)
        const user = await User.findOne({email: testUser.email})
        expect(user.avatar).toBe(undefined)
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