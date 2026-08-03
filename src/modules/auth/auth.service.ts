import { prisma } from '../../config/prismaClient';
import { ApiError } from '../../utils/apiError';
import { hashPassword, comparePassword } from '../../utils/hash';
import { signToken } from '../../utils/jwt';
import { RegisterInput, LoginInput } from './auth.schema';

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  });
  if (existing) {
    throw ApiError.conflict(
      existing.email === input.email ? 'Cet e-mail est déjà utilisé.' : "Ce nom d'utilisateur est déjà pris."
    );
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { name: input.name, username: input.username, email: input.email, passwordHash },
  });

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw ApiError.unauthorized('Identifiants incorrects');

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw ApiError.unauthorized('Identifiants incorrects');

  const token = signToken({ userId: user.id, role: user.role });
  return { user, token };
}
