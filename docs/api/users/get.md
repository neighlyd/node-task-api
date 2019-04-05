# List All Users

Retrieve a list of all users.

**URL** : `/users`

**Method** : `GET`

**Auth required** : YES

## Success Response

**Condition** : User is authenticated.

**Code** : `200 OK`

**Content example** : 

```json
{
    "userCount": 2,
    "users": [
        {
            "_id": "5ca79afc1362dcefcf612040",
            "name": "Dustin Neighly",
            "email": "dustin.neighly@example.com",
            "createdAt": "2019-04-05T18:14:20.701Z",
            "updatedAt": "2019-04-05T19:08:51.602Z",
            "__v": 4
        },
        {
            "_id": "5ca7a7b5a44ae8f339ac2499",
            "name": "Bob Loblaw",
            "email": "bob.loblaw@example.com",
            "createdAt": "2019-04-05T19:08:37.892Z",
            "updatedAt": "2019-04-05T19:08:37.961Z",
            "__v": 1
        }
    ]
}
```

## Error Response
**Condition** : User provides no or invalid JWT Token.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": "Please authenticate."
}
```