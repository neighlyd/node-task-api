# Register

Used to register a user and retrieve a JWT Token.

**URL** : `/users/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "name": "[name in plain text]",
    "email": "[unique and valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "name": "Dustin Neighly",
    "email": "dustin.neighly@example.com",
    "password": "hunter21"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2E3OWFmYzEzNjJkY2VmY2Y2MTIwNDAiLCJpYXQiOjE1NTQ0ODgwNjAsImV4cCI6MTU1NTY5NzY2MH0.1HrSG8sWpoLVZQ3Ri6E1mNRdzY2cVFZKaHpRRPLD99Y",
    "user": {
        "_id": "5ca79afc1362dcefcf612040",
        "name": "Dustin Neighly",
        "email": "dustin.neighly@example.com",
        "createdAt": "2019-04-05T18:14:20.701Z",
        "updatedAt": "2019-04-05T18:14:20.777Z",
        "__v": 1
    }
}
```

## Error Response
**Condition** : If 'email' is not unique.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "driver": true,
    "name": "MongoError",
    "index": 0,
    "code": 11000,
    "errmsg": "E11000 duplicate key error collection: task-app.users index: email_1 dup key: { : \"dustin.neighly@example.com\" }"
}
```
---------

**Condition** : If 'name', 'email' or 'password' is not supplied.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "errors": {
        "password": {
            "message": "Path `password` is required.",
            "name": "ValidatorError",
            "properties": {
                "message": "Path `password` is required.",
                "type": "required",
                "path": "password"
            },
            "kind": "required",
            "path": "password"
        },
        "email": {
            "message": "Path `email` is required.",
            "name": "ValidatorError",
            "properties": {
                "message": "Path `email` is required.",
                "type": "required",
                "path": "email"
            },
            "kind": "required",
            "path": "email"
        },
        "name": {
            "message": "Path `name` is required.",
            "name": "ValidatorError",
            "properties": {
                "message": "Path `name` is required.",
                "type": "required",
                "path": "name"
            },
            "kind": "required",
            "path": "name"
        }
    },
    "_message": "User validation failed",
    "message": "User validation failed: password: Path `password` is required., email: Path `email` is required., name: Path `name` is required.",
    "name": "ValidationError"
}
```