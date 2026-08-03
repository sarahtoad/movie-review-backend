import { Request, Response, NextFunction } from 'express';
import { parsePagination } from '../../utils/pagination';
import { createMovie, getMovieById, listMovies, findExistingMovie, deleteMovie , updateMovie} from './movie.service';

export async function postMovie(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(await createMovie(req.user!.id, req.body));
  } catch (err) {
    next(err);
  }
}

export async function checkDuplicate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const title =
      typeof req.query.title === "string" ? req.query.title : "";

    const year =
      typeof req.query.year === "string"
        ? Number(req.query.year)
        : 0;

    if (!title || !year) {
      return res.status(400).json({
        error: "Title and year are required",
      });
    }

    const existing = await findExistingMovie(title, year);

    res.json({
      exists: !!existing,
      movie: existing,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMovie(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id =
      typeof req.params.id === "string"
        ? req.params.id
        : "";

    if (!id) {
      res.status(400).json({
        error: "Movie id is required",
      });
      return;
    }

    const movie = await getMovieById(id, req.user?.id);

    res.json(movie);
  } catch (err) {
    next(err);
  }
}

export async function getMovies(req: Request, res: Response, next: NextFunction) {
  try {
    const { skip, limit, page } = parsePagination(req.query as any);
    const { genre, sort } = req.query;
    const { movies, total } = await listMovies({
      skip,
      limit,
      genre: genre ? String(genre) : undefined,
      sort: sort ? String(sort) : undefined,
    });
    res.json({ movies, total, page, limit });
  } catch (err) {
    next(err);
  }
}

export async function putMovie(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string; // Forçage du type
    const updated = await updateMovie(id, req.user!.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteMovieController(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Extraction et extraction sécurisée sous forme de string
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      return res.status(400).json({ error: "L'ID du film est requis." });
    }

    const result = await deleteMovie(id, req.user!.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}