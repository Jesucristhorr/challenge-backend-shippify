import { getClientSummaryBodySchema } from '../schemas/clientSummary.schemas';
import { prisma } from '../database/prisma';
import { METHOD, route } from '../decorators/route.decorator';

import { TypedRequestBody, validateRequest } from 'zod-express-middleware';

export class ClientSummary {
  @route({
    method: METHOD.POST,
    path: '/client-summary',
    middlewares: [validateRequest({ body: getClientSummaryBodySchema })],
  })
  public async getClientSummary(
    req: TypedRequestBody<typeof getClientSummaryBodySchema>,
  ) {
    const { userId, startDate, endDate } = req.body;

    const start = new Date(startDate);

    const end = new Date(endDate);

    const charges = await prisma.charge.findMany({
      select: {
        id: true,
        amount: true,
        user: true,
        createdAt: true,
        updatedAt: true,
      },
      where: {
        userId,
        AND: [
          {
            createdAt: {
              gte: start,
            },
          },
          {
            createdAt: {
              lte: end,
            },
          },
        ],
      },
    });

    const visits = await prisma.userVisit.count({
      where: {
        userId,
        AND: [
          {
            createdAt: {
              gte: start,
            },
          },
          {
            createdAt: {
              lte: end,
            },
          },
        ],
      },
    });

    const basePrice = charges.reduce(
      (prevValue, currentValue) => prevValue + currentValue.amount.toNumber(),
      0,
    );

    // negative value
    const insurance = basePrice > 100 ? (basePrice * 0.05) / 100 : 0;

    // negative value
    let services = 0;

    if (visits === 4) services = (basePrice * 0.02) / 100;

    if (visits > 4) {
      services = (basePrice * 0.02) / 100;

      for (let i = 4; i < visits; i++) {
        services += 0.25;
      }
    }

    const iva = 12;

    const otherValues = (basePrice * iva) / 100;

    return {
      basePrice,
      insurance,
      services,
      iva,
      otherValues,
      finalValue: basePrice + otherValues - insurance - services,
    };
  }
}
