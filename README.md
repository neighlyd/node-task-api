# Task App

The Task App allows users to create accounts and track their tasks, marking them as completed. It has built-in filtering and querying for tasks. Routes are secured behind authentication and tasks are automatically filtered by user profile. The API connects to a mongoDB instance that preserves all user and task information.

A demo of the API can be reached at https://neighly-task-app.herokuapp.com/

# API Documentation
The following endpoints are accessible through the API. Select each to read more about the data constraints, responses, errors, and to see examples.

## Open Endpoints

Open endpoints require no authentication

* [Register](/docs/api/register.md) : `POST /users/`
* [Login](/docs/api/login.md) : `POST /users/login`
  
## Endpoints Requiring Authentication
Closed endpoints require a valid JWT Token to be included in the request header. The JWT Token can be acquired through either the [Register] or [Login] endpoints above. The JWT Token is expected in the standard form:
```
Authorization: Bearer <JWT Token>
```

### User Endpoints
____
These endpoints affect the currently authenticated user determined by the JWT Token header using the [authenticate.js](/src/middleware/authenticate.js) middleware.

The code for these routes can be found in [routes/user.js](/src/routes/user.js).

* [List All Users](/docs/api/users/get.md): `GET /users`
* [Show Info (self)](/docs/api/users/me/get.md): `GET /users/me`
* [Update Info (self)](/docs/api/users/me/patch.md): `PATCH /users/me`
* [Show Info (other)](/docs/api/users/id/get.md): `GET /users/:id`
* [Update Info (other)](/docs/api/users/id/patch.md): `PATCH /users/:id`
* [Delete Info (other)](/docs/api/users/id/delete.md): `DELETE /users/:id`
* [Logout Single](/docs/api/users/logout.md): `POST /users/logout`
* [Logout All Sessions](/docs/api/users/logoutAll.md): `POST /users/logoutAll`
* [Upload Avatar](/docs/api/users/me/avatar/post.md): `POST /users/me/avatar`
* [Show Avatar](/docs/api/users/:id/avatar): `GET /users/:id/avatar`
* [Delete Avatar](/docs/api/users/me/avatar): `DELETE /users/me/avatar`

### Task Endpoints
____
These endpoints show and affect the tasks for a given user. The user is determined by the JWT Token header using the [authenticate.js](/src/middleware/authenticate.js) middleware.

The code for these routes can be found in [routes/task.js](/src/routes/task.js).

* [List All Tasks](/docs/api/tasks/get.md): `GET /tasks`
* [Create Single Task](/docs/api/tasks/post.md): `POST /tasks`
* [Show Single Task](/docs/api/tasks/id/get.md): `GET /tasks/:id`
* [Update Single Task](/docs/api/tasks/id/patch.md): `PATCH /tasks/:id`
* [Delete Single Task](/docs/api/tasks/id/delete.md): `DELETE /tasks/:id`

# Installation

If you want to install your own version of the task app api please follow these instructions. 

## Requirements
The following software is required to run the task app api.
* `git`
* `node`
* `mongodb`

## Installation and Usage
To install and run locally:
* [First make sure your mongoDB database is up and running.](https://docs.mongodb.com/manual/installation/#mongodb-community-edition)

```bash
$ git clone git://github.com/neighlyd/node-todo-api
$ cd node-todo-api
$ npm install
$ mkdir config
$ cd config
$ touch dev.env test.env
```

Your dev.env and test.env files should have the following key-value pairs within them.

```
#dev.env
PORT=3000
MONGODB_URI="mongodb://localhost:27017/task-app"
JWT_SECRET="Type some random stuff in here to generate a secret key for JWT"
SENDGRID_API_KEY="Your Sendgrid API key goes here"
```

```
#test.env
PORT=3000
MONGODB_URI="mongodb://localhost:27017/task-app-test"
JWT_SECRET="More random stuff in here for another JWT secret Key"
SENDGRID_API_KEY="Your Sendgrid API key again here"
```

If you need information on setting up a Sendgrid API key, [check out this tutorial.](https://sendgrid.com/docs/for-developers/sending-email/api-getting-started/)

Finally, run:

```bash
$ npm run dev
```

This will launch the task app at `localhost:3000/`

---------
If you wish to deploy the app remotely to heroku, I recommend viewing their [Getting Started on Heroku with Node.js tutorial](https://devcenter.heroku.com/articles/getting-started-with-nodejs).

## Testing

Once you have the app installed, you can test it by running the following command:

```bash
$ npm test
```

## Feedback

If you have any feedback, suggestions, or thoughts, please feel free to drop me a line in the issues tab or by sending me an email at neighlyd at gmail.

## Acknowledgements

@andrew_j_mead
Udemy Link

@jamescooke
https://github.com/jamescooke/restapidocs
