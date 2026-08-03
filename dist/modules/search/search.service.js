"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSearch = globalSearch;
const prismaClient_1 = require("../../config/prismaClient");
async function globalSearch(query) {
    const q = query.trim();
    if (!q)
        return { movies: [], users: [], genres: [] };
    const [movies, users, genres] = await Promise.all([
        prismaClient_1.prisma.movie.findMany({
            where: { title: { contains: q, mode: 'insensitive' } },
            take: 8,
            select: { id: true, title: true, year: true, posterUrl: true, averageRating: true },
        }),
        prismaClient_1.prisma.user.findMany({
            where: {
                OR: [
                    { username: { contains: q, mode: 'insensitive' } },
                    { name: { contains: q, mode: 'insensitive' } },
                ],
            },
            take: 8,
            select: { id: true, username: true, name: true, avatar: true },
        }),
        prismaClient_1.prisma.genre.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 8 }),
    ]);
    return { movies, users, genres };
}
