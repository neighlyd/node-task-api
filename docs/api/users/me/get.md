# Get Authenticated User Profile

Retrieve profile of authenticated user. This is a convenience route.

**URL** : `/users/me`

**Method** : `GET`

**Auth required** : YES

**Data constraints** : `{}`

## Success Response

**Condition** : User is authenticated.

**Code** : `200 OK`

**Content example** : 

```json
{
    "_id": "5ca79afc1362dcefcf612040",
    "name": "Dustin Neighly",
    "email": "dustin.neighly@example.com",
    "createdAt": "2019-04-05T18:14:20.701Z",
    "updatedAt": "2019-04-05T19:08:51.602Z",
    "__v": 4
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