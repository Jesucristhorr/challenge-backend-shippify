import { prisma } from '../database/prisma';
import { METHOD, route } from '../decorators/route.decorator';
import {
  deleteChargesParamsSchema,
  getChargesParamsSchema,
  postChargesBodySchema,
  putChargesBodySchema,
} from '../schemas/charges.schemas';

import {
  validateRequest,
  TypedRequestBody,
  TypedRequestParams,
} from 'zod-express-middleware';
import { Response } from 'express';

export class Charges {
  @route({
    method: METHOD.GET,
    path: '/charges',
  })
  public async getCharges() {
    return await prisma.charge.findMany();
  }

  @route({
    method: METHOD.GET,
    path: '/charges/:id',
    middlewares: [validateRequest({ params: getChargesParamsSchema })],
  })
  public async getCharge(
    req: TypedRequestParams<typeof getChargesParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    const charge = await prisma.charge.findUnique({
      select: {
        id: true,
        amount: true,
        lastEvent: true,
        user: true,
      },
      where: { id: Number(id) },
    });

    if (!charge) {
      res.status(404);
      return {
        msg: `charge doesn't exist`,
      };
    }

    return charge;
  }

  @route({
    method: METHOD.POST,
    path: '/charges',
    middlewares: [validateRequest({ body: postChargesBodySchema })],
  })
  public async createCharge(
    req: TypedRequestBody<typeof postChargesBodySchema>,
    res: Response,
  ) {
    const { amount, lastEventId, userId } = req.body;

    res.status(201);

    return await prisma.charge.create({
      data: {
        amount,
        lastEventId: Number(lastEventId),
        userId: Number(userId),
      },
    });
  }

  @route({
    method: METHOD.PUT,
    path: '/charges',
    middlewares: [validateRequest({ body: putChargesBodySchema })],
  })
  public async updateCharge(req: TypedRequestBody<typeof putChargesBodySchema>) {
    const { id, amount, lastEventId, userId } = req.body;

    return await prisma.charge.update({
      data: {
        amount,
        lastEventId: Number(lastEventId),
        userId: Number(userId),
      },
      where: {
        id,
      },
    });
  }

  @route({
    method: METHOD.DELETE,
    path: '/charges/:id',
    middlewares: [validateRequest({ params: deleteChargesParamsSchema })],
  })
  public async deleteCharge(
    req: TypedRequestParams<typeof deleteChargesParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    res.status(204);

    return await prisma.charge.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
