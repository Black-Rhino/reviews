# System Design Capstone | Ratings and Reviews API Service

## :pushpin: Table of Contents
* [Project Overview](#telescope-project-overview)
* [Project Details](#jigsaw-project-details)
* [Installation](#pencil2-installation)
* [Routes](#rocket-routes)
* [Future Optimizations](#mag-roadmap---future-optimizations)  

## :hammer_and_pick: Tech Stack
![JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NodeJS](https://img.shields.io/badge/Node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23316192.svg?&style=for-the-badge&logo=postgresql&logoColor=white)
![K6](https://img.shields.io/badge/K6%20-CA4245.svg?&style=for-the-badge&logo=k6&logoColor=white)
![Mocha](https://img.shields.io/badge/-mocha%20-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)
![ESLint](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)


## :telescope: Project Overview
This project was created for my System Design Capstone.

The task was to build out the back-end system for a product ratings and reviews service for an e-commerce web application. 
The main objective of this project was scaling and optimizations to manage the high incoming traffic. An ETL process was implemented to transfer the full application data set of about 30 millions records into a PostgreSQL database. The goal here was to handle at least 1000 requests per second with a latency of less than 2 seconds and an error rate of less than 1%.


## :jigsaw: Project Details
This service handles requests for displaying product ratings and reviews. This includes the average rating of a product, the number of each star rating, the ability to filter by star rating, and how users rated some of the product's characteristics such as comfort, fit, and quality. The review list can also be sorted by newest, helpful, and relevant. 

The service was incrementally optimized through query writing, database indexing, connection pooling, and load balancing to quickly obtain MVP. 

Stress testing with k6 showed that indexing improved query time by 90%. Each of my queries had an average latency of less than 20 ms for 100 users and 220 ms for 1000 users with a 0.0% error rate. Cloud testing with Loader.io showed that the max number of requests my system could handle with one database server and one service layer was around 100 requests with an average latency of 2 seconds. Horizontally scaling by using NGINX as my load balancer and adding one more server was able to improve latency by about 60% with a 0.0% error rate. The server and Postgres database were deployed on separate AWS EC2 instances.

## :pencil2: Installation
To get a local copy up and running follow these simple steps:
###### Pre-Installation Requirements
    Node
    NPM

###### Instructions
1. Fork and then Clone the repo to your GitHub.
   ```
   git clone https://github.com/Black-Rhino/reviews.git
   ```
2. Install all NPM packages.
   ```
   npm install
    ```
3. Start the server.
   ```
   npm run server
    ```
4. Navigate to your web browser: http://localhost:3000/

## :rocket: Routes

| Request Type | Endpoint                    | Description                                                                | Status |
|--------------|-----------------------------|----------------------------------------------------------------------------|:--------:|
| GET          | /reviews/:product_id/list   | Returns a list of reviews for a product, excluding any reported reviews    | 200    |
| GET          | /reviews/:product_id/meta   | Returns review metadata for a given product                                | 200    |
| POST         | /reviews/:product_id        | Adds a review for the given product                                        | 201    |
| PUT          | /reviews/:review_id/helpful | Updates a review to mark it as helpful                                     | 204    |
| PUT          | /reviews/:review_id/report  | Updates a review to mark it as reported                                    | 204    |
| DELETE       | /reviews/:review_id         | Deletes a review                                                           | 204    |

### Examples of responses
### Review List
**Status: 200 OK**
```
{
  "product": "2",
  "page": 0,
  "count": 5,
  "results": [
    {
      "review_id": 5,
      "rating": 3,
      "summary": "I'm enjoying wearing these shades",
      "recommend": false,
      "response": null,
      "body": "Comfortable and practical.",
      "date": "2019-04-14T00:00:00.000Z",
      "reviewer_name": "shortandsweeet",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/review_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/review_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    {
      "review_id": 3,
      "rating": 4,
      "summary": "I am liking these glasses",
      "recommend": false,
      "response": "Glad you're enjoying the product!",
      "body": "They are very dark. But that's good because I'm in very sunny spots",
      "date": "2019-06-23T00:00:00.000Z",
      "reviewer_name": "bigbrotherbenjamin",
      "helpfulness": 5,
      "photos": [],
    },
    // ...
  ]
}

```

### Review Metadata
**Status: 200 OK**
```
{
  "product_id": "2",
  "ratings": {
    2: 1,
    3: 1,
    4: 2,
    // ...
  },
  "recommended": {
    0: 5
    // ...
  },
  "characteristics": {
    "Size": {
      "id": 14,
      "value": "4.0000"
    },
    "Width": {
      "id": 15,
      "value": "3.5000"
    },
    "Comfort": {
      "id": 16,
      "value": "4.0000"
    },
    // ...
}
```

## :mag: Roadmap - Future Optimizations
* Implementing a caching system to avoid unnecessary database queries and recalculations
* Considering a separate database for the /GET meta endpoint
* Running more metrics tests to have a more detailed analysis on where the system performs well and where the bottlenecks are


[[Back to Top]](#pushpin-table-of-contents)
