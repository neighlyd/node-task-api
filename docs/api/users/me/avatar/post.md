# Upload User Avatar

Upload an avatar for user profile.

**URL** : `/users/me/avatar`

**Method** : `POST`

**Auth required** : YES

**Data constraints** :
```html
POST /users/me/avatar HTTP/1.1
Content-Type: multipart/form-data; boundary=MultipartBoundry

--MultipartBoundry
Content-Disposition: form-data; name="avatar"; filename="image_name.jpg"
Content-Type: image/jpeg

```
> Note: This route receives `multipart/form-data` rather than a `JSON` object. Its key-value pairs are `avatar` and a file ending in `.jpg`, `.jpeg`, or `.png`.

> Note: The image must be below 1 Megabyte in size.
> 
## Success Response

**Condition** : User exists, file ends in .jpg/.jpeg/.png, and image is below 1MB.

**Code** : `200 OK`

**Content example** : The image is resized to a 250 x 300 pixels and uploaded into the MongoDB store as a buffered object. Returns the user object.

```json
{
    "_id": "5ca7aee0a44ae8f339ac249f",
    "name": "Bob Loblaw",
    "email": "bob.loblaw@example.com",
    "createdAt": "2019-04-05T19:39:12.793Z",
    "updatedAt": "2019-04-05T19:51:09.516Z",
    "__v": 1
}
```

## Error Response
**Condition** : User attempts to upload a profile picture of wrong type, for example `word.doc`

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error": "Please upload an image"
}
```

-----

**Condition** : User attempts to upload a profile picture that is larger than 1 Megabyte.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error": "File too large"
}
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