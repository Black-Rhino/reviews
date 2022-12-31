-- to run this file in psql: \i database/schema.sql;

DROP TABLE IF EXISTS "reviews";

CREATE TABLE "reviews" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INT,
  "rating" SMALLINT CHECK (rating > 0 AND rating < 6),
  "date" BIGINT,
  "summary" TEXT,
  "body" TEXT,
  "recommend" BOOLEAN,
  "reported" BOOLEAN DEFAULT false,
  "reviewer_name" TEXT,
  "reviewer_email" TEXT,
  "response" TEXT DEFAULT '',
  "helpfulness" INT DEFAULT 0
);

DROP TABLE IF EXISTS "reviews_photos";

CREATE TABLE "reviews_photos" (
  "id" SERIAL PRIMARY KEY,
  "review_id" INT,
  "url" TEXT
);

DROP TABLE IF EXISTS "characteristics";

CREATE TABLE "characteristics" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INT,
  "name" TEXT
);

DROP TABLE IF EXISTS "characteristics_reviews";

CREATE TABLE "characteristics_reviews" (
  "id" SERIAL PRIMARY KEY,
  "characteristic_id" INT,
  "review_id" INT,
  "value" SMALLINT CHECK (value > 0 AND value < 6)
);

COPY reviews FROM '/home/linhwatson/immersive/reviews/database/reviews.csv' DELIMITER ',' CSV HEADER;
COPY reviews_photos FROM '/home/linhwatson/immersive/reviews/database/reviews_photos.csv' DELIMITER ',' CSV HEADER;
COPY characteristics FROM '/home/linhwatson/immersive/reviews/database/characteristics.csv' DELIMITER ',' CSV HEADER;
COPY characteristics_reviews FROM '/home/linhwatson/immersive/reviews/database/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

CREATE INDEX idx_reviews_product_id ON reviews (product_id, rating, recommend);
CREATE INDEX idx_characteristics_product_id ON characteristics (product_id, name);
CREATE INDEX idx_characteristics_reviews_characteristic_id ON characteristics_reviews (characteristic_id, value);
CREATE INDEX idx_reviews_photos_review_id ON reviews_photos (review_id);

SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
SELECT setval('characteristics_id_seq', (SELECT MAX(id) FROM characteristics));
SELECT setval('characteristics_reviews_id_seq', (SELECT MAX(id) FROM characteristics_reviews));
SELECT setval('reviews_photos_id_seq', (SELECT MAX(id) FROM reviews_photos));