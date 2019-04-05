# Logout All User Sessions

Remove **all** JWT Tokens from user profile.

> Note: The difference between `/logout` and `/logoutAll` is that `/logout` only removes the token supplied in the header, effectively logging the user out from their current device. `/logoutAll` removes every JWT Token from their user profile, removing their account's access from every device.

**URL** : `/users/logoutAll`

**Method** : `POST`

**Auth required** : YES

## Success Response

**Condition** : User is authenticated.

**Code** : `200 OK`

**Content example** : 
```json
OK
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