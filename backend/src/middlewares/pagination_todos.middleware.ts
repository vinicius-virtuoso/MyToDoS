import { NextFunction, Request, Response } from "express";

export const paginationTodosMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryPage = Number(req.query.page);
  const queryPerPage = Number(req.query.perPage);

  const page = queryPage && queryPage > 1 ? queryPage : 1;
  const perPage =
    queryPerPage && queryPerPage <= 10 && queryPerPage > 0 && queryPerPage <= 20
      ? queryPerPage
      : 20;

  const baseUrl = `${process.env.BASE_URL}/todos`;

  const prevPage = `${baseUrl}/todos?page=${page - 1}&perPage=${perPage}`;
  const nextPage = `${baseUrl}/todos?page=${page + 1}&perPage=${perPage}`;

  res.locals = {
    ...res.locals,
    pagination: {
      page: perPage * (page - 1),
      perPage,
      prevPage,
      nextPage,
    },
  };
  return next();
};
