
## Description

An ecommerce store where clients can add items to their cart and checkout to successfully place an order. Every nth order gets a coupon code for 10% discount and can apply to their cart.
User APIs for adding items to cart and checkout functionality. The checkout API would validate if the discount code is valid before giving the discount.

The store also has two admin API's:

Generate a discount code if the condition above is satisfied.
Lists count of items purchased, total purchase amount, list of discount codes and total discount amount.

## Installation

```bash
$ git clone https://github.com/khushboo683/uniblox-backend.git
$ cd uniblox-backend

$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Technologies Used

Backend Framework: NestJS

Programming Language: TypeScript

Database: MongoDB

Containerization: Docker

Cloud Provider: AWS EC2
