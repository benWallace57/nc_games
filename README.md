# Northcoders House of Games API

## Background

This project creates a mock API for the purpose of accessing application data programmatically. The intention here is to mimick the building of a real world backend service which should provide this information to the front end architecture.

In this case the API is for a boardgame review website.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Setting up your project

git clone https://github.com/benWallace57/nc_games.git
cd into repo
npm i (This will install all the node dependencies)

npm run setup-dbs (This will set up the databases which will check whether PSQL is correctly configured on your machine. )

npm run seed:prod (This will set the database to production)
npm start (this will run listen.js)

You will need to create _two_ `.env` files for your project: `.env.test` and `.env.development`. Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names). Double check that these `.env` files are .gitignored.

The job of `index.js` in each the data folders is to export out all the data from that folder, currently stored in separate files. This is so that, when you need access to the data elsewhere, you can write one convenient require statement - to the index file, rather than having to require each file individually. Think of it like a index of a book - a place to refer to! Make sure the index file exports an object with values of the data from that folder with the keys:

- `categoryData`
- `reviewData`
- `userData`
- `commentData`

## Endpoints

_This is a summary of all the endpoints. More detail about each endpoint is further down this document._

```http
GET /api

GET /api/categories
POST /api/categories

GET /api/reviews
POST /api/reviews

GET /api/reviews/:review_id
PATCH /api/reviews/:review_id
DELETE /api/reviews/:review_id

GET /api/reviews/:review_id/comments
POST /api/reviews/:review_id/comments


DELETE /api/comments/:comment_id
PATCH /api/comments/:comment_id

GET /api/users
GET /api/users/:username
```

---

#### **GET /api**

Responds with:

- JSON describing all the available endpoints on the API

---

- [ ] This app is hosted on https://nc-games-bw.herokuapp.com/api

#### **GET /api/categories**

Responds with:

- an array of category objects, each of which should have the following properties:
  - `slug`
  - `description`

---

#### **GET /api/reviews/:review_id**

Responds with:

- a review object, which should have the following properties:

  - `owner` which is the `username` from the users table
  - `title`
  - `review_id`
  - `review_body`
  - `designer`
  - `review_img_url`
  - `category`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this review_id

---

#### **PATCH /api/reviews/:review_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current review's vote property by 1

  `{ inc_votes : -100 }` would decrement the current review's vote property by 100

Responds with:

- the updated review

---

#### **GET /api/reviews**

Responds with:

- an `reviews` array of review objects, each of which should have the following properties:
  - `owner` which is the `username` from the users table
  - `title`
  - `review_id`
  - `category`
  - `review_img_url`
  - `created_at`
  - `votes`
  - `comment_count` which is the total count of all the comments with this review_id

Should accept queries:

- `sort_by`, which sorts the reviews by any valid column (defaults to date)
- `order`, which can be set to `asc` or `desc` for ascending or descending (defaults to descending)
- `category`, which filters the reviews by the category value specified in the query
  - `limit`, which limits the number of responses (defaults to 10)
  - `p`, stands for page which specifies the page at which to start (calculated using limit)
- returns a `total_count` property, displaying the total number of reviews (**this should display the total number of reviews with any filters applied, discounting the limit**)

---

#### **GET /api/reviews/:review_id/comments**

Responds with:

- an array of comments for the given `review_id` of which each comment should have the following properties:
  - `comment_id`
  - `votes`
  - `created_at`
  - `author` which is the `username` from the users table
  - `body`

---

#### **POST /api/reviews/:review_id/comments**

Request body accepts:

- an object with the following properties:
  - `username`
  - `body`

Responds with:

- the posted comment

Accepts query paramaters

- `limit`, which limits the number of responses (defaults to 10)
- `p`, stands for page which specifies the page at which to start (calculated using limit)

---

#### **DELETE /api/comments/:comment_id**

Should:

- delete the given comment by `comment_id`

Responds with:

- status 204 and no content

---

---

#### **GET /api/users**

Responds with:

- an array of objects, each object should have the following property:
  - `username`

---

#### **GET /api/users/:username**

Responds with:

- a user object which should have the following properties:
  - `username`
  - `avatar_url`
  - `name`

---

#### **PATCH /api/comments/:comment_id**

Request body accepts:

- an object in the form `{ inc_votes: newVote }`

  - `newVote` will indicate how much the `votes` property in the database should be updated by

  e.g.

  `{ inc_votes : 1 }` would increment the current comment's vote property by 1

  `{ inc_votes : -1 }` would decrement the current comment's vote property by 1

Responds with:

- the updated comment

---

#### POST /api/reviews

Request body accepts:

- an object with the following properties:

  - `owner` which is the `username` from the users table
  - `title`
  - `review_body`
  - `designer`
  - `category` which is a `category` from the categories table

Responds with:

- the newly added review, with all the above properties as well as:
  - `review_id`
  - `votes`
  - `created_at`
  - `comment_count`

#### POST /api/categories

Request body accepts:

- an object in the form:

```json
{
  "slug": "category name here",
  "description": "description here"
}
```

Responds with:

- a category object containing the newly added category

#### DELETE /api/reviews/:review_id

Should:

- delete the given review by review_id

Respond with:

- status 204 and no content
