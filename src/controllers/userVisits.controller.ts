import { prisma } from '../database/prisma';
import { METHOD, route } from '../decorators/route.decorator';
import {
  deleteUserVisitsParamsSchema,
  getUserVisitsParamsSchema,
  postUserVisitsBodySchema,
  putUserVisitsBodySchema,
} from '../schemas/userVisits.schemas';

import {
  validateRequest,
  TypedRequestBody,
  TypedRequestParams,
} from 'zod-express-middleware';
import { Response } from 'express';

export class UserVisits {
  @route({
    method: METHOD.GET,
    path: '/user-visits',
  })
  public async getUserVisits() {
    return await prisma.userVisit.findMany();
  }

  @route({
    method: METHOD.GET,
    path: '/user-visits/:id',
    middlewares: [validateRequest({ params: getUserVisitsParamsSchema })],
  })
  public async getUserVisit(
    req: TypedRequestParams<typeof getUserVisitsParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    const userVisit = await prisma.userVisit.findUnique({
      select: {
        id: true,
        user: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id: Number(id) },
    });

    if (!userVisit) {
      res.status(404);
      return {
        msg: `user visit doesn't exist`,
      };
    }

    return userVisit;
  }

  @route({
    method: METHOD.POST,
    path: '/user-visits',
    middlewares: [validateRequest({ body: postUserVisitsBodySchema })],
  })
  public async createUserVisit(
    req: TypedRequestBody<typeof postUserVisitsBodySchema>,
    res: Response,
  ) {
    const { userId } = req.body;

    res.status(201);

    return await prisma.userVisit.create({
      data: {
        userId: Number(userId),
      },
    });
  }

  @route({
    method: METHOD.PUT,
    path: '/user-visits',
    middlewares: [validateRequest({ body: putUserVisitsBodySchema })],
  })
  public async updateUserVisit(req: TypedRequestBody<typeof putUserVisitsBodySchema>) {
    const { userId, id } = req.body;

    return await prisma.userVisit.update({
      data: {
        userId: Number(userId),
      },
      where: {
        id: Number(id),
      },
    });
  }

  @route({
    method: METHOD.DELETE,
    path: '/user-visits/:id',
    middlewares: [validateRequest({ params: deleteUserVisitsParamsSchema })],
  })
  public async deleteUserVisit(
    req: TypedRequestParams<typeof deleteUserVisitsParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    res.status(204);

    return await prisma.userVisit.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
