import './controllers';
import { router } from './controllers/router';

import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') dotenv.config();

export class Server {
  constructor(private readonly _app: Express) {
    _app.set('port', process.env.PORT ?? 3000);
    this.configureMiddlewares();
    this.mergeRouter();
  }

  get app(): Express {
    return this._app;
  }

  private configureMiddlewares() {
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use(cors());
    this._app.use(morgan(process.env.NODE_ENV !== 'production' ? 'common' : 'tiny'));
  }

  private mergeRouter() {
    this._app.use('/api/v1', router);
  }

  public start() {
    const port = this._app.get('port');
    this._app.listen(port, () => {
      console.log(`Server is running in port ${port}`);
    });
  }
}
