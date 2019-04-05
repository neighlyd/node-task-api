# Retrieve User Avatar by ID

Get an avatar for user profile by id.

**URL** : `/users/:id/avatar`

**Method** : `GET`

**Auth required** : YES

## Success Response

**Condition** : User exists and has an uploaded avatar file.

**Code** : `200 OK`

**Content example** : The resized image is returned to the requesting user as the body content along with the following HTML headers.

```html
X-Powered-By: Express
Content-Type: image/png
Content-Length: 163122
ETag: W/"27d32-kRiX/nK9EN4cc2vd056YDPJJ85U"
Date: Fri, 05 Apr 2019 19:57:31 GMT
Connection: keep-alive

<image.jpg>
```

## Error Response
**Condition** : User attempts to get an avatar for a user without one uploaded.

**Code** : `404 NOT FOUND`

**Content** :

```json
Not Found
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