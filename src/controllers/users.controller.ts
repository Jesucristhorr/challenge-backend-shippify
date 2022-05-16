import { prisma } from '../database/prisma';
import { METHOD, route } from '../decorators/route.decorator';
import {
  deleteUserParamsSchema,
  getUserParamsSchema,
  postUserBodySchema,
  putUserBodySchema,
} from '../schemas/users.schemas';

import {
  validateRequest,
  TypedRequestBody,
  TypedRequestParams,
} from 'zod-express-middleware';
import { Response } from 'express';

export class Users {
  @route({
    method: METHOD.GET,
    path: '/users',
  })
  public async getUsers() {
    return await prisma.user.findMany();
  }

  @route({
    method: METHOD.GET,
    path: '/users/:id',
    middlewares: [validateRequest({ params: getUserParamsSchema })],
  })
  public async getUser(
    req: TypedRequestParams<typeof getUserParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        charges: true,
        visits: true,
        summaries: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id: Number(id) },
    });

    if (!user) {
      res.status(404);
      return {
        msg: `user doesn't exist`,
      };
    }

    return user;
  }

  @route({
    method: METHOD.POST,
    path: '/users',
    middlewares: [validateRequest({ body: postUserBodySchema })],
  })
  public async createUser(
    req: TypedRequestBody<typeof postUserBodySchema>,
    res: Response,
  ) {
    const { firstName, lastName } = req.body;

    res.status(201);

    return await prisma.user.create({
      data: {
        firstName,
        lastName,
      },
    });
  }

  @route({
    method: METHOD.PUT,
    path: '/users',
    middlewares: [validateRequest({ body: putUserBodySchema })],
  })
  public async updateUser(req: TypedRequestBody<typeof putUserBodySchema>) {
    const { id, firstName, lastName } = req.body;

    return await prisma.user.update({
      data: {
        firstName,
        lastName,
      },
      where: {
        id,
      },
    });
  }

  @route({
    method: METHOD.DELETE,
    path: '/users/:id',
    middlewares: [validateRequest({ params: deleteUserParamsSchema })],
  })
  public async deleteUser(
    req: TypedRequestParams<typeof deleteUserParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    res.status(204);

    return await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
