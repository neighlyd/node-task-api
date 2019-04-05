# List All Tasks

Show all tasks belonging to an authenticated user.

**URL** : `/tasks/`

**Method** : `GET`

**Auth required** : YES

**URL Params** : 

* Filter By Completion: `?completed=true/false/null`
* Pagination: `?limit=<#>&skip=<#>`
* Sorting: `?sortBy=createdAt:asc/desc`

**Data constraints** : `{}`

## Success Response

**Condition** : User does not have any tasks.

**Code** : `200 OK`

**Content example**

```json
{
    "tasks": []
}
```
----

**Condition** : User has one or more tasks.

**Code** : `200 OK`

**Content example**

```json
{
    "tasks": [
        {
            "completed": false,
            "_id": "5ca79e8571cdbbf0eb35ee22",
            "text": "Example Task",
            "owner": "5ca79afc1362dcefcf612040",
            "createdAt": "2019-04-05T18:29:25.534Z",
            "updatedAt": "2019-04-05T18:29:25.534Z",
            "__v": 0
        },
        {
            "completed": true,
            "_id": "5ca79e9871cdbbf0eb35ee23",
            "text": "Another Example Task",
            "owner": "5ca79afc1362dcefcf612040",
            "createdAt": "2019-04-05T18:29:44.082Z",
            "updatedAt": "2019-04-05T18:29:44.082Z",
            "__v": 0
        },
        {
            "completed": false,
            "_id": "5ca7a01a71cdbbf0eb35ee24",
            "text": "Third Task",
            "owner": "5ca79afc1362dcefcf612040",
            "createdAt": "2019-04-05T18:36:10.263Z",
            "updatedAt": "2019-04-05T18:36:10.263Z",
            "__v": 0
        }
    ]
}
```
----
**Condition** : `GET /tasks/?completed=false&sortBy=createdAt:desc`

**Code** : `200 OK`

**Content example**

```json
{
    "tasks": [
        {
            "completed": false,
            "_id": "5ca7a01a71cdbbf0eb35ee24",
            "text": "Third Task",
            "owner": "5ca79afc1362dcefcf612040",
            "createdAt": "2019-04-05T18:36:10.263Z",
            "updatedAt": "2019-04-05T18:36:10.263Z",
            "__v": 0
        },
        {
            "completed": false,
            "_id": "5ca79e8571cdbbf0eb35ee22",
            "text": "Example Task",
            "owner": "5ca79afc1362dcefcf612040",
            "createdAt": "2019-04-05T18:29:25.534Z",
            "updatedAt": "2019-04-05T18:29:25.534Z",
            "__v": 0
        }
    ]
}
```
----
**Condition** : `GET /tasks/?&sortBy=createdAt:desc&limit=2&skip=1`

**Code** : `200 OK`

**Content example**

```json
{
    "tasks": [
        {
            "completed": true,
            "_id": "5ca79e9871cdbbf0eb35ee23",
            "text": "Another Example Task",
            "owner": "5ca79afc1362dcefcf612040",
            "createdAt": "2019-04-05T18:29:44.082Z",
            "updatedAt": "2019-04-05T18:29:44.082Z",
            "__v": 0
        },
        {
            "completed": false,
            "_id": "5ca79e8571cdbbf0eb35ee22",
            "text": "Example Task",
            "owner": "5ca79afc1362dcefcf612040",
            "createdAt": "2019-04-05T18:29:25.534Z",
            "updatedAt": "2019-04-05T18:29:25.534Z",
            "__v": 0
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