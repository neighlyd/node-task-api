# Task App

The Task App allows users to create accounts and track their tasks, marking them as completed. It has built-in filtering and querying for tasks. Routes are secured behind authentication and tasks are automatically filtered by user. The API connects to a MongoDB that preserves all user and task information.

# API Documentation
The following endpoints are accessible through the API. Click on each to read more about the data constraints, responses, errors, and to see examples.

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

* [List All Users](): `GET /users`
* [Show Info (self)](): `GET /users/me`
* [Update Info (self)](): `PATCH /users/me`
* [Show Info (other)](): `GET /users/:id`
* [Update Info (other)](): `PATCH /users/:id`
* [Delete Info (other)](): `DELETE /users/:id`
* [Logout](): `POST /users/logoutAll`
* [Upload Avatar](): `POST /users/me/avatar`
* [Delete Avatar](): `DELETE /users/me/avatar`
* [Show Avatar](): `GET /users/:id/avatar`

### Task Endpoints
____
These endpoints show and affect the tasks for a given user. The user is determined by the JWT Token header using the [authenticate.js](/src/middleware/authenticate.js) middleware.

The code for these routes can be found in [routes/task.js](/src/routes/task.js).

* [List All Tasks](/docs/api/tasks/get.md): `GET /tasks`
* [Create Single Task](/docs/api/tasks/post.md): `POST /tasks`
* [Show Single Task](/docs/api/tasks/id/get.md): `GET /tasks/:id`
* [Update Single Task](/docs/api/tasks/id/patch.md): `PATCH /tasks/:id`
* [Delete Single Task](/docs/api/tasks/id/delete.md): `DELETE /tasks/:id`

