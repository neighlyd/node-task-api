# Update Single Task

Update a single task belonging to an authenticated user.

**URL** : `/tasks/:id`

**Method** : `PATCH`

**Auth required** : YES

**Permission Required** : User is Task Creator

**Data constraints**

```json
{
    "text": "[plaintext string]",
    "completed": "[boolean value]"
}
```

**Data Examples**
Partial data is allowed.
```json
{
    "text": "Updated Task"
}
```

## Success Response

**Condition** : Task exists, values are correct, and user is authenticated.

**Code** : `200 OK`

**Content example** : A user sets the task with `id` of `5ca7a2c655a600f15fbcf0eb` with the "text" of "Example Task" to `{"completed": "true"}`.

```json
{
    "completed": true,
    "_id": "5ca7a2c655a600f15fbcf0eb",
    "text": "Example Task",
    "owner": "5ca79afc1362dcefcf612040",
    "createdAt": "2019-04-05T18:47:34.123Z",
    "updatedAt": "2019-04-05T18:59:54.772Z",
    "__v": 0
}
```
> Note: Because Partial Data is allowed, sending no data will return a 200 OK response.

## Error Response
**Condition** : Task does not exist but user provides correct JWT Token.

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