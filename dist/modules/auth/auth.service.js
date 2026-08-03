"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const prismaClient_1 = require("../../config/prismaClient");
const apiError_1 = require("../../utils/apiError");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
async function registerUser(input) {
    const existing = await prismaClient_1.prisma.user.findFirst({
        where: { OR: [{ email: input.email }, { username: input.username }] },
    });
    if (existing) {
        throw apiError_1.ApiError.conflict(existing.email === input.email ? 'Cet e-mail est déjà utilisé.' : "Ce nom d'utilisateur est déjà pris.");
    }
    const passwordHash = await (0, hash_1.hashPassword)(input.password);
    const user = await prismaClient_1.prisma.user.create({
        data: { name: input.name, username: input.username, email: input.email, passwordHash },
    });
    const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
    return { user, token };
}
async function loginUser(input) {
    const user = await prismaClient_1.prisma.user.findUnique({ where: { email: input.email } });
    if (!user)
        throw apiError_1.ApiError.unauthorized('Identifiants incorrects');
    const valid = await (0, hash_1.comparePassword)(input.password, user.passwordHash);
    if (!valid)
        throw apiError_1.ApiError.unauthorized('Identifiants incorrects');
    const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
    return { user, token };
}
