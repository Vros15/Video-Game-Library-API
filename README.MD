#  Video Game Library API

A RESTful API built with **Node.js**, **Express**, and **Lodash** that allows users to manage a collection of video games and gaming platforms. This project demonstrates REST API design, Express routing, query parameters, reusable utility functions, and CRUD operations.

---

## 🚀 Features

### Games

* Retrieve all games
* Retrieve a game by ID
* Create a new game
* Update an existing game
* Delete a game
* Sort games by name or release year
* Sort in ascending or descending order

### Platforms

* Retrieve all gaming platforms
* Retrieve a platform by ID
* Sort platforms by name or release year
* Sort in ascending or descending order

---

# 🛠 Technologies Used

* Node.js
* Express.js
* Lodash
* Morgan
* UUID

---

# 📂 Project Structure

```text
video-game-library-api/
│
├── data/
│   ├── games.js
│   └── platforms.js
│
├── routes/
│   ├── games-router.js
│   └── platforms-router.js
│
├── index.js
├── utils.js
├── package.json
└── README.md
```

### Folder Overview

| Folder/File  | Purpose                                                                       |
| ------------ | ----------------------------------------------------------------------------- |
| **index.js** | Creates the Express application, configures middleware, and registers routers |
| **routes/**  | Contains all API endpoint logic                                               |
| **data/**    | Stores local game and platform data                                           |
| **utils.js** | Contains reusable helper functions (sorting)                                  |

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/video-game-library-api.git
```

Navigate into the project

```bash
cd video-game-library-api
```

Install dependencies

```bash
npm install
```

Start the server

```bash
node index.js
```

The API will run at

```text
http://localhost:3000
```

---

# 📚 API Endpoints

## Games

| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/api/v1/games`     | Retrieve all games      |
| GET    | `/api/v1/games/:id` | Retrieve a game by ID   |
| POST   | `/api/v1/games`     | Create a new game       |
| PUT    | `/api/v1/games/:id` | Update an existing game |
| DELETE | `/api/v1/games/:id` | Delete a game           |

---

## Platforms

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| GET    | `/api/v1/platforms`     | Retrieve all platforms    |
| GET    | `/api/v1/platforms/:id` | Retrieve a platform by ID |

---

# 🔎 Sorting

Games and platforms can be sorted using query parameters.

## Sort by name

```http
GET /api/v1/games?sortBy=name
```

## Sort by release year

```http
GET /api/v1/games?sortBy=releaseYear
```

## Descending order

```http
GET /api/v1/games?sortBy=releaseYear&order=desc
```

## Ascending order (default)

```http
GET /api/v1/games?sortBy=name&order=asc
```

---

# 📥 Example POST Request

```json
{
  "name": "Halo Infinite",
  "genres": ["Shooter", "Action"],
  "releaseYear": 2021,
  "platforms": ["Xbox Series X", "PC"]
}
```

---

# 🧠 Concepts Demonstrated

* RESTful API design
* Express Routers
* Middleware
* CRUD operations
* Route parameters
* Query parameters
* Array methods (`find`, `filter`, `sort`)
* Reusable helper functions
* Modular project architecture
* HTTP status codes
* UUID generation
* JSON request handling

---

# 🔮 Future Improvements

* Input validation
* Error-handling middleware
* Persistent database (MongoDB or PostgreSQL)
* Search by game title
* Filter by genre
* Filter by platform
* Pagination
* Unit and integration tests
* Swagger/OpenAPI documentation
* Authentication and authorization


Feel free to connect or provide feedback!
