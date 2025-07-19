
# News Aggregator API

## Overview
A Node.js REST API for aggregating news articles based on user preferences, with authentication, caching, and user actions (read/favorite/search).

## Features
- JWT authentication for protected routes
- User registration and login
- User preferences for news categories and languages
- Fetch news from NewsAPI with caching
- Mark articles as read or favorite
- Retrieve read/favorite articles
- Search news articles by keyword
- Periodic cache updates

## Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd news-aggregator-api-Sathya-94
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   JWT_SECRET=your_jwt_secret
   NEWS_API_KEY=your_newsapi_key
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints & Example Usage

### Auth
- `POST /users/signup` - Register a new user
  ```sh
  curl -X POST http://localhost:3000/users/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"Clark Kent","email":"clark@superman.com","password":"Krypt()n8","preferences":["movies","comics"]}'
  ```

- `POST /users/login` - Login and receive JWT token
  ```sh
  curl -X POST http://localhost:3000/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"clark@superman.com","password":"Krypt()n8"}'
  ```

### Preferences
- `GET /users/preferences` - Get user preferences
  ```sh
  curl -X GET http://localhost:3000/users/preferences \
    -H "Authorization: Bearer <JWT_TOKEN>"
  ```

- `PUT /users/preferences` - Update user preferences
  ```sh
  curl -X PUT http://localhost:3000/users/preferences \
    -H "Authorization: Bearer <JWT_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"preferences":["movies","comics","games"]}'
  ```

### News
- `GET /news` - Get news articles based on preferences
  ```sh
  curl -X GET http://localhost:3000/news \
    -H "Authorization: Bearer <JWT_TOKEN>"
  ```

- `POST /news/:id/read` - Mark article as read
  ```sh
  curl -X POST http://localhost:3000/news/<ARTICLE_ID>/read \
    -H "Authorization: Bearer <JWT_TOKEN>"
  ```

- `POST /news/:id/favorite` - Mark article as favorite
  ```sh
  curl -X POST http://localhost:3000/news/<ARTICLE_ID>/favorite \
    -H "Authorization: Bearer <JWT_TOKEN>"
  ```

- `GET /news/read` - Get all read articles
  ```sh
  curl -X GET http://localhost:3000/news/read \
    -H "Authorization: Bearer <JWT_TOKEN>"
  ```

- `GET /news/favorites` - Get all favorite articles
  ```sh
  curl -X GET http://localhost:3000/news/favorites \
    -H "Authorization: Bearer <JWT_TOKEN>"
  ```

- `GET /news/search/:keyword` - Search articles by keyword
  ```sh
  curl -X GET http://localhost:3000/news/search/<KEYWORD> \
    -H "Authorization: Bearer <JWT_TOKEN>"
  ```

## Testing
Run all tests:
```sh
npm run test
```

## License
MIT
