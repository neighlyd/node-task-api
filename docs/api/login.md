# Login

Used to login a user and retrieve a JWT Token.

**URL** : `/users/login`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "email": "[unique and valid email address]",
    "password": "[password in plain text]"
}
```

**Data example**

```json
{
    "email": "dustin.neighly@example.com",
    "password": "hunter21"
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Y2E3OWFmYzEzNjJkY2VmY2Y2MTIwNDAiLCJpYXQiOjE1NTQ0ODg0MDksImV4cCI6MTU1NTY5ODAwOX0.1y-ua32-kdHEhej75yIXhj2oJaxD7UGf4RmACELzoyA",
    "user": {
        "_id": "5ca79afc1362dcefcf612040",
        "name": "Dustin Neighly",
        "email": "dustin.neighly@example.com",
        "createdAt": "2019-04-05T18:14:20.701Z",
        "updatedAt": "2019-04-05T18:20:09.856Z",
        "__v": 2
    }
}
```

## Error Response
**Condition** : If 'email' and 'password' combination is incorrect or not supplied.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "non_field_errors": [
        "Unable to login with provided credentials."
    ]
}
```