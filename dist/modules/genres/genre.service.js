"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listGenres = listGenres;
exports.findOrCreateGenres = findOrCreateGenres;
const prismaClient_1 = require("../../config/prismaClient");
async function listGenres() {
    return prismaClient_1.prisma.genre.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { movies: true } } },
    });
}
async function findOrCreateGenres(names) {
    const genres = [];
    for (const name of names) {
        const genre = await prismaClient_1.prisma.genre.upsert({ where: { name }, update: {}, create: { name } });
        genres.push(genre);
    }
    return genres;
}
