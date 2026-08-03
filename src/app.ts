import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import path from 'path';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';

import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/users/user.routes';
import { movieRoutes } from './modules/movies/movie.routes';
import { genreRoutes } from './modules/genres/genre.routes';
import { reviewRoutes } from './modules/reviews/review.routes';
import { reviewInteractionRoutes } from './modules/reviewInteractions/reviewInteraction.routes';
import { statusRoutes } from './modules/userMovieStatus/status.routes';
import { searchRoutes } from './modules/search/search.routes';
import { activityRoutes } from './modules/activity/activity.routes';
import { trendingRoutes } from './modules/trending/trending.routes';
import { notificationRoutes } from './modules/notifications/notification.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { favoriteRoutes } from './modules/favorite/favorite.routes';
import { watchlistRoutes } from './modules/watchlist/watchlist.routes';
export const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/movies/:movieId/reviews', reviewRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/trending', trendingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(notFoundMiddleware);
app.use(errorMiddleware);
