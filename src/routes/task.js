const express = require('express')

const Task = require('../models/task')
const authenticate = require('../middleware/authenticate')
const validateID = require('../middleware/validateID')

const router = new express.Router()

router.post('/tasks', authenticate, async (req, res) => {
    try {
        const task = new Task({
            text: req.body.text,
            owner: req.user._id
        });
        const doc = await task.save();
        res.send(doc)
    } catch (e) {
        res.status(400).send(e);
    };
});

// GET /tasks?completed=true(false/null)
// GET /tasks?limit=<#>skip=<#> (pagination)
// GET /tasks?sortBy=createdAt:asc
router.get('/tasks', authenticate, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send({tasks: req.user.tasks});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/tasks/:id', authenticate, validateID, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.id,
            owner: req.user._id
        });
        if (!task) {
            return res.sendStatus(404);
        }
        // id found
        res.send({task});
    } catch (e) {
        res.sendStatus(400);
    }
});

router.delete('/tasks/:id', authenticate, validateID, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.id,
            owner: req.user.id
        });

        if(!task){
                return res.sendStatus(404);
            }

        res.send({task});
    } catch (e) {
        res.sendStatus(400);
    }
});

router.patch('/tasks/:id', authenticate, validateID, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['text', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }
    
    try {
        const task = await Task.findOne({_id: req.id, owner: req.user.id})

        if (!task) {
            return res.sendStatus(404);
        }
        
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }catch (e) {
        console.log(e)
        res.status(400).send(e);
    }
});

module.exports = router