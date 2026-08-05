"use strict";
// app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const path_1 = __importDefault(require("path"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = require("./modules/auth/auth.routes");
const user_routes_1 = require("./modules/users/user.routes");
const movie_routes_1 = require("./modules/movies/movie.routes");
const genre_routes_1 = require("./modules/genres/genre.routes");
const review_routes_1 = require("./modules/reviews/review.routes");
const status_routes_1 = require("./modules/userMovieStatus/status.routes");
const search_routes_1 = require("./modules/search/search.routes");
const activity_routes_1 = require("./modules/activity/activity.routes");
const trending_routes_1 = require("./modules/trending/trending.routes");
const notification_routes_1 = require("./modules/notifications/notification.routes");
const dashboard_routes_1 = require("./modules/dashboard/dashboard.routes");
const admin_routes_1 = require("./modules/admin/admin.routes");
const favorite_routes_1 = require("./modules/favorite/favorite.routes");
const watchlist_routes_1 = require("./modules/watchlist/watchlist.routes");
exports.app = (0, express_1.default)();
// 1. Define allowed origins (Localhost + Production Vercel)
const allowedOrigins = [
    'https://movie-review-wj5l.vercel.app',
    ...(env_1.env.frontendUrl ? [env_1.env.frontendUrl] : []),
];
// 2. Configure CORS dynamically
exports.app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman, mobile apps, curl)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    credentials: true,
}));
exports.app.use(express_1.default.json());
exports.app.use((0, cookie_parser_1.default)());
exports.app.get('/health', (_req, res) => res.json({ status: 'ok' }));
exports.app.use('/api/auth', auth_routes_1.authRoutes);
exports.app.use('/api/users', user_routes_1.userRoutes);
exports.app.use('/api/movies', movie_routes_1.movieRoutes);
exports.app.use('/api/movies/:movieId/reviews', review_routes_1.reviewRoutes);
exports.app.use('/api/genres', genre_routes_1.genreRoutes);
exports.app.use('/api/reviews', review_routes_1.reviewRoutes);
exports.app.use('/api/status', status_routes_1.statusRoutes);
exports.app.use('/api/search', search_routes_1.searchRoutes);
exports.app.use('/api/activity', activity_routes_1.activityRoutes);
exports.app.use('/api/trending', trending_routes_1.trendingRoutes);
exports.app.use('/api/notifications', notification_routes_1.notificationRoutes);
exports.app.use('/api/dashboard', dashboard_routes_1.dashboardRoutes);
exports.app.use('/api/admin', admin_routes_1.adminRoutes);
exports.app.use('/api/favorites', favorite_routes_1.favoriteRoutes);
exports.app.use('/api/watchlist', watchlist_routes_1.watchlistRoutes);
exports.app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
exports.app.use(error_middleware_1.notFoundMiddleware);
exports.app.use(error_middleware_1.errorMiddleware);
