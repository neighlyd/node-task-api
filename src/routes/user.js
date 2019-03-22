const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user')
const authenticate = require('../middleware/authenticate')
const validateID = require('../middleware/validateID')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')

const router = new express.Router()

const avatarUpload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    try {
        await user.save();
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken();
        res.status(201).send({token, user})
    } catch(e) {
        res.status(400).send(e);
    }
});

router.get('/users', authenticate, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const users = await User.find();
        // Send the users back as an object, since that allows us to expand it in the future with additional properties.
        res.send({userCount, users});
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/users/me', authenticate, async (req, res) => {
    res.send(req.user)
});

router.patch('/users/me', authenticate, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates.'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
});

router.get('/users/:id', authenticate, validateID, async (req, res) => {
    try {
        if((req.user.id == req.id) || (req.user.admin === true)){
            const user = await User.findById(req.id);
            res.send(user);
        } else {
            res.sendStatus(401)
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/users/:id', authenticate, validateID, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    // only allow updates if valid updates.
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Updates'})
    }
    
    try {
        if ((req.user.id == req.id) || (req.user.admin === true)){
            const user = await User.findById(req.id)
            updates.forEach((update) => user[update] = req.body[update])
            await user.save()
            res.send({user})
        } else {
            res.sendStatus(401)
        }
    } catch (e) {
        res.status(400).send(e)
    }
});

router.delete('/users/:id', authenticate, validateID, async (req, res) => {
    try {
        if ((req.id == req.user._id) || (req.user.admin === true)){
            const user = await User.findByIdAndDelete(req.id)
            if(!user) {
                return res.sendStatus(404)
            }
            sendCancelEmail(user.email, user.name)
            return res.send(user)
        } else {
            return res.sendStatus(401)
        }
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({token, user});
    } catch (e) {
        res.sendStatus(400);
    }
});

router.post('/users/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()

        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(500)
    }
})

router.post('/users/logoutAll', authenticate, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.sendStatus(200)
    } catch (e) {
        res.sendStatus(500)
    }
})

router.post('/users/me/avatar', authenticate, avatarUpload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize(250, 300).toBuffer()
    
    req.user.avatar = buffer

    await req.user.save()
    res.send(req.user)
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', authenticate, avatarUpload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.sendStatus(200)
})

router.get('/users/:id/avatar', validateID, async (req, res) => {
    try{
        const user = await User.findById(req.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.sendStatus(404)
    }
})

module.exports = router