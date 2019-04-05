# Delete User By ID

Delete a user by id. Returns an object containing the deleted user information.

**URL** : `/users/:id`

**Method** : `DELETE`

**Auth required** : YES

**Permission Required** : User or Admin

**Data constraints** : `{}`

## Success Response

**Condition** : User exists and is self or Admin.

**Code** : `200 OK`

**Content example** : The user is deleted from the server, their tasks are removed. The client receives a copy of the deleted object.

```json
{
    "_id": "5ca7a7b5a44ae8f339ac2499",
    "name": "Bob Loblaw",
    "email": "bob.loblaw@example.com",
    "createdAt": "2019-04-05T19:08:37.892Z",
    "updatedAt": "2019-04-05T19:38:36.380Z",
    "__v": 2
}
```

## Error Response
**Condition** : User attempts to delete a profile but is not authenticated as that profile or is not an admin.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
Unauthorized
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