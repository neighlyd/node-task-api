const mongoose = require('mongoose');

mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

let Todo = mongoose.model('Todo', {
   text: {
       type: String
   },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

let newTodo = new Todo({
    text: 'Take medicine',
    completed: true,
    completedAt: 123451
});

newTodo.save().then((doc) => {
    console.log(`Saved todo ${doc}`)
}, (e) => {
    console.log('Unable to save Todo')
});
