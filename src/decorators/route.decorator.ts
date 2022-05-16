import { router } from '../controllers/router';
import { Request, RequestHandler, Response } from 'express';

export enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

interface RouteProps {
  method: METHOD;
  path: string;
  middlewares?: RequestHandler<never>[];
}

export function route({ method, path, middlewares }: RouteProps): MethodDecorator {
  return function (_, __, descriptor: PropertyDescriptor) {
    const response = async (req: Request, res: Response) => {
      try {
        const original = await descriptor.value(req, res);

        res.json({
          data: original,
        });
      } catch (err) {
        res.status(500).json({
          msg: 'An error has ocurred',
          error: err instanceof Error ? err.message : err,
        });
      }
    };

    if (!middlewares) {
      router[method](path, response);
      return;
    }

    const handlers = [...middlewares, response];

    router[method](path, ...handlers);
  };
}
