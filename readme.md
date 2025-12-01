# DEAL Express

# Installation & Run the project

---
To install the packages required for the project do the following command in a terminal : 

```
git clone https://github.com/Itstritix/DevAPIFinal
```


Install the dependency & run the project
```
npm install
npm run dev
```

# Endpoints + example of use

---

### 1. Authentification

```POST /api/auth/register``` Register (user by default)
```json
{
    "username": "<username>",
    "email": "<email>",
    "password": "<password>"
}
```
<br>

```POST /api/auth/login``` Login + get the JWT
```json
{
    "email": "user@gmail.com",
    "password": "password"
}
```
<br>

```GET /api/auth/me``` To show the user profile
```json
{
    "email": "user@gmail.com",
    "password": "password"
}
```

### 2. Deals

```GET /api/deals``` List of approved deals with pagination

```GET /api/deals/search?q=<keyword>``` Search with keywords
<br>

```GET /api/deals/<dealId>``` Details of the deals, with the temp, the comments, and the author

```POST /api/deals``` Create a deal

```json
{ 
    "title":"Test product 4",
    "description":"Ceci est le produit test 4",
    "price":14.99,
    "category":"mode"
}
```
<br>

```PUT /api/deals/<dealId>``` Edit the deal if it is pending

```DELETE /api/deals/<dealId>``` Delete deal

### 3. Votes

```POST /api/deals/<dealId>/vote``` Add a vote

|  Type  |
|:------:|
|  cold  |
|  hot   |

```json
{
    "type": "<type>"
}
```
<br>

```DELETE /api/deals/<dealId>/vote``` Remove the vote

### 4. Commentaires

```GET /api/deals/<dealId>/comments``` List of the comment from a deal

```POST /api/deals/<dealId>/comments``` Add a comment
```json
{
  "content": "Test content for comment"
}
```
<br>

```PUT /api/comments/<commentId>``` Edit your comment
```json
{
  "content": "Updated content for comment"
}
```
<br>

```DELETE /api/comments/<commentId>``` Delete your comment

### 5. Modération (moderator/admin)

```GET /api/admin/deals/pending``` List of pending deals

```PATCH /api/admin/deals/:id/moderate``` Approve or reject a deal

|  Status   |
|:---------:|
| approved  |
| rejected  |

```json
{
  "status": "approved"
}
```

### 6. Administration (admin only)

```GET /api/admin/users``` List of users

```PATCH /api/admin/users/:userId/role``` Edit the role of a user

|    Role    |
|:----------:|
|    user    |
| moderator  |
|   admin    |

```json
{
  "role": "moderator"
}
```

# Test account

---

| Username  |        Email        | Password |   Role    |
|:---------:|:-------------------:|:--------:|:---------:|
|   User    |   user@gmail.com    | password |   User    |
| Moderator | moderator@gmail.com | password | Moderator |
|   Admin   |   admin@gmail.com   | password |   Admin   |


