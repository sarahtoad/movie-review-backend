# CineHub — Backend

## Installation

```bash
cd backend
npm install
cp .env.example .env   # puis renseigner DATABASE_URL et JWT_SECRET
npx prisma migrate dev --name init
npm run prisma:seed    # optionnel : données de démo
npm run dev             # démarre sur http://localhost:4000
```

## Routes principales

| Domaine        | Endpoint                                  |
|-----------------|--------------------------------------------|
| Auth            | POST /api/auth/register, /login, /logout, GET /me |
| Utilisateurs    | GET /api/users/:username, PATCH /api/users/me |
| Films           | GET/POST /api/movies, GET /api/movies/:id, GET /api/movies/check-duplicate |
| Genres          | GET /api/genres |
| Avis            | GET /api/reviews/movie/:movieId, POST/PATCH/DELETE /api/reviews |
| Interactions    | POST /api/reviews/:reviewId/like, POST /api/reviews/:reviewId/comments |
| Statuts         | POST /api/status/favorites/:movieId, POST /api/status/watchlist/:movieId |
| Recherche       | GET /api/search?q=... |
| Fil d'activité  | GET /api/activity/feed, GET /api/activity/me |
| Tendances       | GET /api/trending |
| Notifications   | GET /api/notifications, PATCH /api/notifications/:id/read |
| Tableau de bord | GET /api/dashboard |
| Admin           | /api/admin/* (réservé aux rôles ADMIN) |
