# Get User Profile by ID

Retrieve profile of user by id.

**URL** : `/users/:id`

**Method** : `GET`

**Auth required** : YES

## Success Response

**Condition** : ID is valid and user is authenticated.

**Code** : `200 OK`

**Content example** : User with `id` of `5ca79afc1362dcefcf612040` accesses `/users/5ca7a7b5a44ae8f339ac2499`

```json
{
    "_id": "5ca7a7b5a44ae8f339ac2499",
    "name": "Bob Loblaw",
    "email": "bob.loblaw@example.com",
    "createdAt": "2019-04-05T19:08:37.892Z",
    "updatedAt": "2019-04-05T19:08:37.961Z",
    "__v": 1
}
```

## Error Response
**Condition** : User tries to access invalid ID with valid JWT Token.

**Code** : `400 BAD REQUEST`

**Content** :

```json
Bad Request
```

---

**Condition** : User provides no or invalid JWT Token.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": "Please authenticate."
}
```