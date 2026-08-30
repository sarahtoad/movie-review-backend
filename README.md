# 🎬 CineHub — Backend API

A production-ready RESTful API built with **Node.js**, **Express.js**, and **Prisma ORM** that powers the CineHub platform.

The backend handles authentication, movie management, reviews, social interactions, personalized lists, notifications, search, and administrative operations.

---

## ✨ Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* HTTP-only cookie sessions
* Secure password hashing with bcrypt
* Role-based access control
* `USER` and `ADMIN` roles
* Authenticated user profile endpoint

### 🎬 Movie Management

* Browse the movie catalog
* Retrieve detailed movie information
* Create and manage movies
* Genre filtering
* Duplicate movie detection
* Trending movie metrics

### ⭐ Reviews & Social Interactions

* Create and retrieve movie reviews
* Star-based ratings
* Dynamic rating calculations
* Like and unlike reviews
* Nested comments
* User activity feeds

### ❤️ Personalized Lists

* Add/remove movies from favorites
* Add/remove movies from watchlist
* User-specific movie status

### 🔔 Notifications & Search

* In-app notifications
* Global movie and user search
* Trending content
* Personalized activity feed

### 🛡️ Admin Dashboard

* Protected administrative endpoints
* Platform management
* User and movie data oversight
* Requires `ADMIN` role

---

## 🛠️ Tech Stack

| Technology     | Usage                               |
| -------------- | ----------------------------------- |
| **Node.js**    | JavaScript runtime                  |
| **Express.js** | REST API framework                  |
| **Prisma ORM** | Database access & schema management |
| **PostgreSQL** | Relational database                 |
| **JWT**        | Authentication                      |
| **bcrypt**     | Password hashing                    |

---

## 📋 Prerequisites

Before running the backend, make sure you have:

* **Node.js 18+**
* **PostgreSQL**
* **npm**
* A configured PostgreSQL database

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cinehub.git
cd cinehub/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on the provided example:

```bash
cp .env.example .env
```

Then configure your environment variables:

```env
PORT=4000
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key"
FRONTEND_URL="http://localhost:3000"
```

> ⚠️ **Important:** Never commit `.env` or expose database credentials, JWT secrets, or other sensitive information.

---

## 🗄️ Database Setup

CineHub uses **Prisma ORM** with **PostgreSQL**.

### Run Migrations

Initialize the database schema:

```bash
npx prisma migrate dev --name init
```

### Seed Demo Data

Populate the database with sample data:

```bash
npm run prisma:seed
```

### Prisma Studio

Open Prisma Studio to inspect and manage your database:

```bash
npx prisma studio
```

---

## 💻 Running the Application

### Development

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:4000
```

### Production

Start the production server:

```bash
npm start
```

---

## 📜 Available Scripts

| Command               | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| `npm run dev`         | Starts the API server in development mode with live reloading |
| `npm start`           | Starts the production API server                              |
| `npm run prisma:seed` | Seeds the database with sample data                           |
| `npx prisma studio`   | Opens Prisma Studio to inspect database tables                |

---

## 🔗 API Endpoints

All API routes are prefixed with `/api`.

### 🔐 Authentication

| Method | Endpoint             | Description                | Auth     |
| ------ | -------------------- | -------------------------- | -------- |
| `POST` | `/api/auth/register` | Register a new user        | Public   |
| `POST` | `/api/auth/login`    | Authenticate a user        | Public   |
| `POST` | `/api/auth/logout`   | Log out the current user   | Required |
| `GET`  | `/api/auth/me`       | Get the authenticated user | Required |

---

### 👤 Users

| Method  | Endpoint               | Description                             | Auth     |
| ------- | ---------------------- | --------------------------------------- | -------- |
| `GET`   | `/api/users/:username` | Get a user's public profile             | Public   |
| `PATCH` | `/api/users/me`        | Update the authenticated user's profile | Required |

---

### 🎬 Movies

| Method | Endpoint                      | Description                 | Auth     |
| ------ | ----------------------------- | --------------------------- | -------- |
| `GET`  | `/api/movies`                 | Get movies from the catalog | Public   |
| `POST` | `/api/movies`                 | Create a new movie          | Required |
| `GET`  | `/api/movies/:id`             | Get movie details           | Public   |
| `GET`  | `/api/movies/check-duplicate` | Check for duplicate movies  | Required |

---

### ⭐ Reviews & Social

| Method | Endpoint                          | Description               | Auth     |
| ------ | --------------------------------- | ------------------------- | -------- |
| `GET`  | `/api/reviews/movie/:movieId`     | Get reviews for a movie   | Public   |
| `POST` | `/api/reviews`                    | Create a movie review     | Required |
| `POST` | `/api/reviews/:reviewId/like`     | Like or unlike a review   | Required |
| `POST` | `/api/reviews/:reviewId/comments` | Add a comment to a review | Required |

---

### ❤️ Favorites & Watchlist

| Method | Endpoint                         | Description                 | Auth     |
| ------ | -------------------------------- | --------------------------- | -------- |
| `POST` | `/api/status/favorites/:movieId` | Toggle a movie in favorites | Required |
| `POST` | `/api/status/watchlist/:movieId` | Toggle a movie in watchlist | Required |

---

### 🔎 Discovery

| Method | Endpoint             | Description             | Auth     |
| ------ | -------------------- | ----------------------- | -------- |
| `GET`  | `/api/search?q=...`  | Search movies and users | Public   |
| `GET`  | `/api/trending`      | Get trending movies     | Public   |
| `GET`  | `/api/activity/feed` | Get user activity feed  | Required |

---

### 🛡️ Administration

| Method | Endpoint       | Description                        | Auth    |
| ------ | -------------- | ---------------------------------- | ------- |
| `*`    | `/api/admin/*` | Administrative platform operations | `ADMIN` |

> 🔒 All `/api/admin/*` endpoints require authentication and the `ADMIN` role.

---

## 🔑 Authentication

CineHub uses **JWT authentication with HTTP-only cookies**.

After successful login, the authentication token is stored in an HTTP-only cookie and automatically sent with subsequent requests.

Protected endpoints require a valid authenticated session.

### User Roles

| Role    | Permissions                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------ |
| `USER`  | Access personal account features, reviews, ratings, favorites, watchlist, comments, and activity |
| `ADMIN` | User permissions + administrative platform operations                                            |

---

## 📂 Project Structure

```text
cinehub/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma database schema
│   │   └── seed.js             # Database seed script
│   │
│   ├── src/
│   │   ├── controllers/        # HTTP request controllers
│   │   ├── middlewares/        # Authentication & error handling
│   │   ├── routes/             # Express API routes
│   │   └── services/           # Business logic & database queries
│   │
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── README.md
│
└── frontend/
    └── ...
```

---

## 🔄 Frontend Integration

The CineHub frontend communicates with this API through the configured backend URL.

Set the frontend environment variable to point to the backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

The backend also uses the `FRONTEND_URL` environment variable for frontend-related configuration such as CORS:

```env
FRONTEND_URL=http://localhost:3000
```

Make sure both the frontend and backend servers are running when developing locally.

---

## 🔒 Security

The backend includes several security mechanisms:

* HTTP-only authentication cookies
* JWT-based authentication
* Password hashing with bcrypt
* Role-based authorization
* Protected API routes
* Environment-based secret management
* Input validation and error handling

> Never expose your `JWT_SECRET`, database credentials, or `.env` file in a public repository.

---

## 🌱 Development Workflow

To contribute to the backend:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

3. Install dependencies

```bash
npm install
```

4. Configure your `.env`
5. Run database migrations
6. Start the development server

```bash
npm run dev
```

7. Test your changes
8. Commit your work

```bash
git add .
git commit -m "feat: add your feature"
```

9. Push your branch

```bash
git push origin feature/your-feature
```

10. Open a Pull Request

---

## 📄 License

This project is developed for educational and development purposes.

---

## 👩‍💻 Author

Developed with ❤️ using **Node.js**, **Express.js**, **Prisma**, and **PostgreSQL**.
