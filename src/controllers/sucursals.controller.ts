import { prisma } from '../database/prisma';
import { METHOD, route } from '../decorators/route.decorator';
import {
  deleteSucursalsParamsSchema,
  getSucursalsParamsSchema,
  postSucursalsBodySchema,
  putSucursalsBodySchema,
} from '../schemas/sucursals.schemas';

import {
  validateRequest,
  TypedRequestBody,
  TypedRequestParams,
} from 'zod-express-middleware';
import { Response } from 'express';

export class Sucursals {
  @route({
    method: METHOD.GET,
    path: '/sucursals',
  })
  public async getSucursals() {
    return await prisma.sucursal.findMany();
  }

  @route({
    method: METHOD.GET,
    path: '/sucursals/:id',
    middlewares: [validateRequest({ params: getSucursalsParamsSchema })],
  })
  public async getSucursal(
    req: TypedRequestParams<typeof getSucursalsParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    const sucursal = await prisma.sucursal.findUnique({
      select: {
        id: true,
        name: true,
        events: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id: Number(id) },
    });

    if (!sucursal) {
      res.status(404);
      return {
        msg: `sucursal doesn't exist`,
      };
    }

    return sucursal;
  }

  @route({
    method: METHOD.POST,
    path: '/sucursals',
    middlewares: [validateRequest({ body: postSucursalsBodySchema })],
  })
  public async createSucursals(
    req: TypedRequestBody<typeof postSucursalsBodySchema>,
    res: Response,
  ) {
    const { name } = req.body;

    res.status(201);

    return await prisma.sucursal.create({
      data: {
        name,
      },
    });
  }

  @route({
    method: METHOD.PUT,
    path: '/sucursals',
    middlewares: [validateRequest({ body: putSucursalsBodySchema })],
  })
  public async updateSucursals(req: TypedRequestBody<typeof putSucursalsBodySchema>) {
    const { id, name } = req.body;

    return await prisma.sucursal.update({
      data: {
        name,
      },
      where: {
        id,
      },
    });
  }

  @route({
    method: METHOD.DELETE,
    path: '/sucursals/:id',
    middlewares: [validateRequest({ params: deleteSucursalsParamsSchema })],
  })
  public async deleteSucursals(
    req: TypedRequestParams<typeof deleteSucursalsParamsSchema>,
    res: Response,
  ) {
    const { id } = req.params;

    res.status(204);

    return await prisma.sucursal.delete({
      where: {
        id: Number(id),
      },
    });
  }
}
