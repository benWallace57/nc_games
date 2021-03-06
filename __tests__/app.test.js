const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("/categories", () => {
    describe("GET", () => {
      test("/api/categories SHOULD return array of all categories", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({ body }) => {
            expect(body.categories.length).toBe(4);
            expect(body.categories[0]).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
      });
      test("/api/notExist SHOULD return 404", () => {
        return request(app)
          .get("/api/notExist")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Route not found");
          });
      });
    });
    describe("POST", () => {
      test("/api/categories should accept new category", () => {
        const newCategory = {
          slug: "Abstract",
          description:
            "A game without a story or law, just colours and mechanics",
        };
        return request(app)
          .post("/api/categories")
          .send(newCategory)
          .expect(201)
          .then(({ body }) => {
            expect(body.categories[0]).toEqual(newCategory);
          });
      });
      test("/api/categories should reject invalid category", () => {
        const newCategory = {
          description:
            "A game without a story or law, just colours and mechanics",
        };
        return request(app)
          .post("/api/categories")
          .send(newCategory)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toEqual(
              "At least one attribute has an invalid value"
            );
          });
      });
      test("/api/categories should reject multiple of same category", async () => {
        const newCategory = {
          slug: "Duplicate Test",
          description: "slug should be unique primary key",
        };
        await request(app)
          .post("/api/categories")
          .send(newCategory)
          .expect(201);
        await request(app)
          .post("/api/categories")
          .send(newCategory)
          .expect(400);
      });
    });
  });

  describe("/reviews", () => {
    describe("GET", () => {
      test("/api/reviews should return all reviews", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews.length).toBe(10);
            expect(body.reviews[0]).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
            expect(body.reviews).toBeSortedBy("created_at", {
              descending: true,
            });
            expect(body.totalCount).toEqual(13);
          });
      });

      test("/api/reviews?sort_by=owner&&order=asc&&category=dexterity", () => {
        return request(app)
          .get("/api/reviews?sort_by=owner&&order=asc&&category=dexterity")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews).toBeSortedBy("owner", { descending: false });
            body.reviews.forEach((review) =>
              expect(review.category).toBe("dexterity")
            );
            expect(body.totalCount).toEqual(1);
          });
      });
      test("/api/reviews?sort_by=fish&&order=bird", () => {
        return request(app)
          .get("/api/reviews?sort_by=fish&&order=bird")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toEqual("Bad Request: Invalid sorting options");
          });
      });
      test("/api/reviews?limit=5&&page=2", () => {
        return request(app)
          .get("/api/reviews?limit=3&&p=3&&sort_by=review_id&&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews.length).toEqual(3);
            expect(body.reviews[0].review_id).toBe(7);
          });
      });
    });
    describe("POST", () => {
      test("/api/reviews should insert new review and return all info", () => {
        const newReview = {
          title: "New test review",
          designer: "B",
          owner: "philippaclaire9",
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          review_body: "D",
          category: "social deduction",
        };
        return request(app)
          .post("/api/reviews")
          .send(newReview)
          .expect(201)
          .then(({ body }) => {
            expect(body.reviews[0]).toMatchObject({
              ...newReview,
              review_id: expect.any(Number),
              votes: 0,
              created_at: expect.any(String),
              comment_count: 0,
            });
          });
      });
      test("/api/reviews should handle invalid user", () => {
        const newReview = {
          title: "New test review",
          designer: "B",
          owner: "b",
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          review_body: "D",
          category: "social deduction",
        };
        return request(app)
          .post("/api/reviews")
          .send(newReview)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toEqual(
              "At least one attribute has an invalid value"
            );
          });
      });
      test("/api/reviews should handle missing title", () => {
        const newReview = {
          designer: "B",
          owner: "philippaclaire9",
          review_img_url:
            "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
          review_body: "D",
          category: "social deduction",
        };
        return request(app)
          .post("/api/reviews")
          .send(newReview)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toEqual(
              "At least one attribute has an invalid value"
            );
          });
      });
    });
  });

  describe("/reviews/:review_id", () => {
    describe("GET", () => {
      test("/api/reviews/:review_id should return single review", () => {
        return request(app)
          .get("/api/reviews/2")
          .expect(200)
          .then(({ body }) => {
            expect(body.reviews.length).toBe(1);
            expect(body.reviews[0]).toMatchObject({
              owner: expect.any(String),
              title: expect.any(String),
              review_id: expect.any(Number),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
      });
      test("/api/reviews/:TOO HIGH should return with error", () => {
        return request(app)
          .get("/api/reviews/200")
          .expect(400)
          .then(({ body }) => {
            {
              expect(body.msg).toEqual("Bad Request: Review ID does not exist");
            }
          });
      });
      test("/api/reviews/:STRING should return with error", () => {
        return request(app)
          .get("/api/reviews/fish")
          .expect(400)
          .then(({ body }) => {
            {
              expect(body.msg).toEqual("Bad Request: invalid input");
            }
          });
      });
    });
    describe("PATCH", () => {
      test("/api/reviews/:reviewID should update votes", async () => {
        const updateObj = { inc_votes: 10 };
        const oldVotes = await request(app).get("/api/reviews/2").expect(200);
        const newVotes = await request(app)
          .patch("/api/reviews/2")
          .send(updateObj)
          .expect(200);
        expect(newVotes.body.reviews[0].votes).toEqual(
          oldVotes.body.reviews[0].votes + 10
        );
      });
      test("/api/reviews/:reviewID should update negative votes", async () => {
        const updateObj = { inc_votes: -10 };
        const oldVotes = await request(app).get("/api/reviews/2").expect(200);
        const newVotes = await request(app)
          .patch("/api/reviews/2")
          .send(updateObj)
          .expect(200);
        expect(newVotes.body.reviews[0].votes).toEqual(
          oldVotes.body.reviews[0].votes - 10
        );
      });
      test("/api/reviews/:reviewID should handle invalid value", async () => {
        const updateObj = { inc_votes: "twenty" };
        const response = await request(app)
          .patch("/api/reviews/2")
          .send(updateObj)
          .expect(400);
        expect(response.body.msg).toBe("Bad Request: invalid input");
      });
      test("/api/reviews/:reviewID should handle invalid key", async () => {
        const updateObj = { falseKey: 10 };
        const response = await request(app)
          .patch("/api/reviews/2")
          .send(updateObj)
          .expect(400);
        expect(response.body.msg).toBe("Bad Request: invalid input");
      });
    });
    describe("DELETE", () => {
      test("/api/reviews/:review_id should delete review", async () => {
        const before = await request(app).get("/api/reviews/1").expect(200);
        await request(app).delete("/api/reviews/1").expect(204);
        const after = await request(app).delete("/api/reviews/1").expect(400);
        expect(after.body.msg).toEqual("Bad Request: Review ID does not exist");
      });
    });
  });

  describe("/reviews/:review_id/comments", () => {
    describe("GET", () => {
      test("/api/reviews/2/comments should return all comments from review", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(3);
            expect(body.comments[0]).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
      });
      test("/api/reviews/200/comments ERROR INVALID ID", () => {
        return request(app)
          .get("/api/reviews/200/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: Review ID does not exist");
          });
      });
      test("/api/reviews/1/comments No results", () => {
        return request(app)
          .get("/api/reviews/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).toBe("No Results");
          });
      });

      test("/api/reviews/1/comments pagination", () => {
        return request(app)
          .get("/api/reviews/2/comments?limit=1&&p=2")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments[0].body).toEqual("EPIC board game!");
          });
      });
    });
    describe("POST", () => {
      test("/api/reviews/:review_id/comments", () => {
        const newComment = {
          username: "bainesface",
          body: "My new comment here",
        };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(newComment)
          .expect(201)
          .then(({ body }) => {
            expect(body.comments[0]).toEqual({ comment_id: 7, ...newComment });
          });
      });
      test("/api/reviews/:review_id/comments INVALID username", () => {
        const newComment = { username: null, body: "My new comment here" };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) =>
            expect(body.msg).toBe("At least one attribute has an invalid value")
          );
      });
      test("/api/reviews/:review_id/comments INVALID BODY", () => {
        const newComment = { username: "Ben", body: null };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) =>
            expect(body.msg).toBe("At least one attribute has an invalid value")
          );
      });
      test("/api/reviews/:review_id/comments mising username", () => {
        const newComment = { body: "invalid test comment" };
        return request(app)
          .post("/api/reviews/2/comments")
          .send(newComment)
          .expect(400)
          .then(({ body }) =>
            expect(body.msg).toBe("At least one attribute has an invalid value")
          );
      });
    });
  });

  describe("/comments", () => {
    describe("DELETE", () => {
      test("/api/comments/:comment_id", async () => {
        await request(app).delete("/api/comments/1").expect(204);
        const err = await request(app).delete("/api/comments/1").expect(400);
        expect(err.body.msg).toEqual("Bad Request: Invalid Comment ID");
      });
      test("/api/comments/:comment_id INVALID ID", async () => {
        const err = await request(app).delete("/api/comments/fish").expect(400);

        expect(err.body.msg).toEqual("Bad Request: invalid input");
      });
    });
    describe("PATCH", () => {
      test("/api/comments/:comment_id should allow update of comment votes", async () => {
        const oldIncObj = { inc_votes: 0 };
        const newIncObj = { inc_votes: 10 };
        const oldComment = await request(app)
          .patch("/api/comments/1")
          .send(oldIncObj)
          .expect(200);
        const newComment = await request(app)
          .patch("/api/comments/1")
          .send(newIncObj)
          .expect(200);

        expect(oldComment.body.comments[0].votes).toEqual(
          newComment.body.comments[0].votes - 10
        );
      });
      test("/api/comments/:comment_id should handle errors", async () => {
        const incObj = { inc_votes: 0 };

        return request(app)
          .patch("/api/comments/100")
          .send(incObj)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toEqual("Bad Request: Invalid Comment ID");
          });
      });

      test("/api/comments/:comment_id should handle object errors", async () => {
        const incObj = { wrongKey: 10 };

        return request(app)
          .patch("/api/comments/1")
          .send(incObj)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toEqual("Bad Request: invalid input");
          });
      });
    });
  });

  describe("/api", () => {
    test("/api should return enpoints.json", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            "GET /api": {
              description:
                "serves up a json representation of all the available endpoints of the api",
            },
            "GET /api/categories": {
              description: "serves an array of all categories",
              queries: [],
              exampleResponse: {
                categories: [
                  {
                    description:
                      "Players attempt to uncover each other's hidden role",
                    slug: "Social deduction",
                  },
                ],
              },
            },
            "GET /api/reviews": {
              description: "serves an array of all reviews",
              queries: ["category", "sort_by", "order"],
              exampleResponse: {
                reviews: [
                  {
                    title: "One Night Ultimate Werewolf",
                    designer: "Akihisa Okui",
                    owner: "happyamy2016",
                    review_img_url:
                      "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                    category: "hidden-roles",
                    created_at: 1610964101251,
                    votes: 5,
                  },
                ],
              },
            },
          });
        });
    });
  });

  describe("/api/users", () => {
    describe("GET", () => {
      test("/api/users should return an array of user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length).toEqual(4);
            expect(body.users[0]).toMatchObject({
              username: expect.any(String),
            });
          });
      });
    });
  });

  describe("/api/users/:username", () => {
    describe("GET", () => {
      test("/api/users/:username should return single user object", () => {
        const expectedUser = {
          username: "mallionaire",
          name: "haz",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        };
        return request(app)
          .get("/api/users/mallionaire")
          .expect(200)
          .then(({ body }) => {
            expect(body.users.length).toEqual(1);
            expect(body.users[0]).toEqual(expectedUser);
          });
      });
      test("/api/users/:username should return single user object", () => {
        return request(app)
          .get("/api/users/fakeUser")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request: Username does not exist");
          });
      });
    });
  });
});
