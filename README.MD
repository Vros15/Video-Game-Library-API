# 🎮 Video Game Library API

A RESTful API built with Node.js, Express, Lodash, and UUID that manages a collection of video games and gaming platforms.

This project demonstrates CRUD operations, query parameter filtering, sorting, middleware usage, and API development fundamentals.

---

## Features

### Games

- Get all games
- Get game by ID
- Create new game
- Update existing game
- Delete game
- Filter by platform
- Filter by genre
- Filter by release year
- Sort by name or release year

### Platforms

- Get all platforms
- Get platform by ID
- Sort platforms by name or release year

---

## Technologies Used

- Node.js
- Express.js
- Lodash
- UUID
- Morgan
- JavaScript

---

## Installation

Clone the repository:

```bash
git clone https://github.com/vros15/video-game-library-api.git
```

Navigate into the project:

```bash
cd video-game-library-api
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node main.js
```

Server will run on:

```text
http://localhost:3000
```

---

## API Routes

### Games

#### Get All Games

```http
GET /api/games
```

#### Get Game By ID

```http
GET /api/games/:id
```

#### Create Game

```http
POST /api/games
```

Request Body:

```json
{
  "name": "Game Title",
  "releaseYear": 2025,
  "genres": ["Action", "Adventure"],
  "platforms": ["PC"]
}
```

#### Update Game

```http
PUT /api/games/:id
```

Request Body Example:

```json
{
  "releaseYear": 2026
}
```

#### Delete Game

```http
DELETE /api/games/:id
```

---

## Filtering

### Filter By Platform

```http
GET /api/games?platform=PC
```

### Filter By Genre

```http
GET /api/games?genre=RPG
```

### Filter By Release Year

```http
GET /api/games?year=2025
```

---

## Sorting

### Sort By Name

```http
GET /api/games?sortBy=name
```

### Sort By Release Year

```http
GET /api/games?sortBy=releaseYear
```

### Descending Order

```http
GET /api/games?sortBy=releaseYear&order=desc
```

---

## Example Query

```http
GET /api/games?platform=PC&sortBy=releaseYear&order=desc
```

Returns all PC games sorted from newest to oldest.

---

## Project Structure

```text
.
├── data
│   ├── games.js
│   └── platforms.js
│
├── main.js
├── package.json
├── package-lock.json
└── README.md
```

---

## Learning Objectives

This project was created to practice:

- REST API development
- Express routing
- CRUD operations
- Query parameters
- Filtering and sorting data
- Working with JSON data
- Middleware configuration
- Error handling
- Git and GitHub workflows
