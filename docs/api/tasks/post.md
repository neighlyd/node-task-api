# Create A Task

Create a task assigned to the authenticated user.

**URL** : `/tasks/`

**Method** : `POST`

**Auth required** : YES

**Data constraints** : `{
    "text": "[plaintext string]"
}`

## Success Response

**Condition** : User is authenticated and provides a valid plaintext string.

**Code** : `200 OK`

**Content example**

```json
{
    "completed": false,
    "_id": "5ca7a2c655a600f15fbcf0eb",
    "text": "Example Task",
    "owner": "5ca79afc1362dcefcf612040",
    "createdAt": "2019-04-05T18:47:34.123Z",
    "updatedAt": "2019-04-05T18:47:34.123Z",
    "__v": 0
}
```

## Error Response
**Condition** : User provides no 'text' for task.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "errors": {
        "text": {
            "message": "Path `text` is required.",
            "name": "ValidatorError",
            "properties": {
                "message": "Path `text` is required.",
                "type": "required",
                "path": "text"
            },
            "kind": "required",
            "path": "text"
        }
    },
    "_message": "Task validation failed",
    "message": "Task validation failed: text: Path `text` is required.",
    "name": "ValidationError"
}
```
----
**Condition** : User provides no or incorrect JWT Token.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": "Please authenticate."
}
```