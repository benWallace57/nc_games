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
  });
});

describe("/reviews", () => {
  describe("GET", () => {
    test("/api/reviews should return all reviews", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews.length).toBe(13);
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
    // test("/api/reviews?sort_by=owner&&order=asc&&category=dexterity", () => {
    //   return request(app)
    //     .get("api/reviews?sort_by=owner&&order=asc&&category=dexterity")
    //     .expect(200)
    //     .then(({ body }) => {
    //       expect(body.reviews).toBeSortedBy("owner", { descending: false });
    //     });
    // });

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
            expect(body.msg).toEqual("Bad Request: Review ID is INVALID");
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
  });
});
