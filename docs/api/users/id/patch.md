# Update User Profile By ID

Update profile of user by id. This route differs from `PATCH /users/me` in that it allows administrators to make changes to user accounts. **Use with caution.**

**URL** : `/users/:id`

**Method** : `PATCH`

**Auth required** : YES

**Permission Required** : User is self or Admin.

**Data constraints**

```json
{
    "name": "[name in plain text]",
    "email": "[unique and valid email address]",
    "password": "[password in plain text]"
}
```

**Data Examples**
Partial data is allowed.
```json
{
    "name": "William Smythe"
}
```


## Success Response

**Condition** : User is authenticated or Admin.

**Code** : `200 OK`

**Content example** : User with `id` of `5ca79afc1362dcefcf612040` with an `admin: true` flag sends a `PATCH /users/5ca7a7b5a44ae8f339ac2499` with body of `{"name": "New Name"}`

```json
{
    "user": {
        "_id": "5ca7a7b5a44ae8f339ac2499",
        "name": "New Name",
        "email": "bob.loblaw@example.com",
        "createdAt": "2019-04-05T18:14:20.701Z",
        "updatedAt": "2019-04-05T19:22:38.371Z",
        "__v": 8
    }
}
```

> Note: If a user or admin updates the password in this fashion, they receive the same response. There is no indication from the server that their password has changed.

See [`PATCH /users/me` for further example.](/docs/api/users/me/patch.md)

> Note: Because Partial Data is allowed, sending no data will return a 200 OK response.

## Error Response
**Condition** : User provides no or invalid JWT Token.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": "Please authenticate."
}
```