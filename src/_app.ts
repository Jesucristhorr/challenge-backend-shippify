import { Server } from './server';
import express from 'express';

const app = express();

const server = new Server(app);

server.start();
