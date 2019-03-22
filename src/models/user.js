const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Task = require('./task');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: val => `${val.value} is not a valid email.`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
    ,
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

UserSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.admin
    delete userObject.avatar

    return userObject
    
};

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

UserSchema.methods.generateAuthToken = async function() {
    let user = this
    let token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '2 weeks'}).toString()

    user.tokens = user.tokens.concat([{token}])
    await user.save()

    return token
};

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
};

// Hash plaintext password before savings.
UserSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    } 
    next()
});

// Delete user tasks on profile delete
UserSchema.post('remove', async function (next) {
    const user = this
    await Task.deleteMany({owner: user._id})
    next()
});

let User = mongoose.model('User', UserSchema);

module.exports = User