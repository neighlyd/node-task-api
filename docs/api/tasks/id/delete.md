# Delete Single Task

Delete a single task belonging to an authenticated user. Returns an object containing the deleted task.

**URL** : `/tasks/:id`

**Method** : `DELETE`

**Auth required** : YES

**Permission Required** : User is Task Creator

## Success Response

**Condition** : Task exists and user is authenticated.

**Code** : `200 OK`

**Content example** : The task is deleted from the server. The client receives a copy of the deleted object.

```json
{
    "task": {
        "completed": true,
        "_id": "5ca7a2c655a600f15fbcf0eb",
        "text": "Example Task",
        "owner": "5ca79afc1362dcefcf612040",
        "createdAt": "2019-04-05T18:47:34.123Z",
        "updatedAt": "2019-04-05T18:59:54.772Z",
        "__v": 0
    }
}
```

## Error Response
**Condition** : Task does not exist but user provides correct JWT Token.

**Code** : `404 NOT FOUND`

**Content** :

```json
Not Found
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