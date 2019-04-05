# Show Single Task

Show a single task belonging to an authenticated user.

**URL** : `/tasks/:id`

**Method** : `GET`

**Auth required** : YES

**Permission Required** : User is Task Creator

## Success Response

**Condition** : Task exists and user is authenticated.

**Code** : `200 OK`

**Content example**

```json
{
    "task": {
        "completed": false,
        "_id": "5ca7a2c655a600f15fbcf0eb",
        "text": "Example Task",
        "owner": "5ca79afc1362dcefcf612040",
        "createdAt": "2019-04-05T18:47:34.123Z",
        "updatedAt": "2019-04-05T18:47:34.123Z",
        "__v": 0
    }
}
```

## Error Response
**Condition** : Task does not exist but user provides correct JWT Token.

**Code** : `400 BAD REQUEST`

**Content** :

```json
Bad Request
```

---

**Condition** : Task exists but does not belong to authenticated user.

**Code** : `400 BAD REQUEST`

**Content** :

```json
Bad Request
```

----

**Condition** : User provides no or invalid JWT Token.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": "Please authenticate."
}
```