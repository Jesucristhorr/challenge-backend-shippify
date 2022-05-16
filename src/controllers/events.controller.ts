import { prisma } from '../database/prisma';
import { METHOD, route } from '../decorators/route.decorator';
import {
  deleteEventsParamsSchema,
  getEventsParamsSchema,
  postEventsBodySchema,
  putEventsBodySchema,
} from '../schemas/events.schemas';

import {
  validateRequest,
  TypedRequestBody,
  TypedRequestParams,
} from 'zod-express-middleware';
import { Response } from 'express';

export class Events {
  @route({
    method: METHOD.GET,
    path: '/events',
  })
  public async getEvents() {
    return await prisma.event.findMany();
  }

  @route({
    method: METHOD.GET,
    path: '/events/:id',
    middlewares: [validateRequest({ params: getEventsParamsSchema })],
  })
  public async getEvent(
    req: TypedRequestParams<typeof getEventsParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      select: {
        id: true,
        type: true,
        sucursal: true,
      },
      where: { id: Number(id) },
    });

    if (!event) {
      res.status(404);
      return {
        msg: `event doesn't exist`,
      };
    }

    return event;
  }

  @route({
    method: METHOD.POST,
    path: '/events',
    middlewares: [validateRequest({ body: postEventsBodySchema })],
  })
  public async createEvent(
    req: TypedRequestBody<typeof postEventsBodySchema>,
    res: Response,
  ) {
    const { typeId, sucursalId } = req.body;

    res.status(201);

    return await prisma.event.create({
      data: {
        typeId: Number(typeId),
        sucursalId: Number(sucursalId),
      },
    });
  }

  @route({
    method: METHOD.PUT,
    path: '/events',
    middlewares: [validateRequest({ body: putEventsBodySchema })],
  })
  public async updateEvent(req: TypedRequestBody<typeof putEventsBodySchema>) {
    const { id, typeId, sucursalId } = req.body;

    return await prisma.event.update({
      data: {
        typeId: Number(typeId),
        sucursalId: Number(sucursalId),
      },
      where: {
        id,
      },
    });
  }

  @route({
    method: METHOD.DELETE,
    path: '/events/:id',
    middlewares: [validateRequest({ params: deleteEventsParamsSchema })],
  })
  public async deleteEvent(
    req: TypedRequestParams<typeof deleteEventsParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    res.status(204);

    return await prisma.event.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
