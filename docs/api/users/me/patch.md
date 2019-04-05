# Update Authenticated User Profile

Update profile of authenticated user. This is a convenience route.

**URL** : `/users/me`

**Method** : `PATCH`

**Auth required** : YES

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

**Condition** : User is authenticated.

**Code** : `200 OK`

**Content example** : User with `id` of `5ca79afc1362dcefcf612040` and previous `name` of `Dustin Neighly` sends a `PATCH /users/me` with body of `{"name": "William Smythe"}`

```json
{
    "user": {
        "_id": "5ca79afc1362dcefcf612040",
        "name": "William Smythe",
        "email": "dustin.neighly@example.com",
        "createdAt": "2019-04-05T18:14:20.701Z",
        "updatedAt": "2019-04-05T19:22:38.371Z",
        "__v": 8
    }
}
```

> Note: If a user updates their password in this fashion, they receive the same response. There is no indication from the server that their password has changed.

**Content example** : User with `id` of `5ca79afc1362dcefcf612040` and previous `password` of `hunter21` sends a `PATCH /users/me` with body of `{"password": "secure_password_21"}`

```json
{
    "user": {
        "_id": "5ca79afc1362dcefcf612040",
        "name": "William Smythe",
        "email": "dustin.neighly@example.com",
        "createdAt": "2019-04-05T18:14:20.701Z",
        "updatedAt": "2019-04-05T19:23:53.146Z",
        "__v": 8
    }
}
```

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