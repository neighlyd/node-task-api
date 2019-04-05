# Delete User Avatar

Delete avatar for user profile.

**URL** : `/users/me/avatar`

**Method** : `DELETE`

**Auth required** : YES

## Success Response

**Condition** : User exists and has an uploaded avatar file.

**Code** : `200 OK`

**Content example** : 

```json
Ok
```

## Error Response
**Condition** : User attempts to delete an avatar without one uploaded.

**Code** : `200 OK`

**Content** :

```json
Ok
```

-----

**Condition** : User provides no or invalid JWT Token.

**Code** : `401 UNAUTHORIZED`

**Content** :

```json
{
    "error": "Please authenticate."
}
```