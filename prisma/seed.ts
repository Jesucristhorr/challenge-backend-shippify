import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();

interface PayloadInfo {
  datetime: string;
  amount: number;
  lastEvent: { type: string; sucursal: string };
}

type Payload = Record<number, PayloadInfo[]>;

(async () => {
  //   create types of event
  await prisma.eventType.createMany({
    data: [
      {
        name: 'debit',
      },
      { name: 'credit' },
    ],
  });

  //   create sucursal
  await prisma.sucursal.createMany({
    data: [
      {
        name: 'A',
      },
    ],
  });

  const fileContent = await fs.readFile('mock/payload.json', { encoding: 'utf8' });

  const payload: Payload = JSON.parse(fileContent);

  const names = [
    'Fernando',
    'José',
    'Eduardo',
    'Camila',
    'Aaron',
    'Jennifer',
    'Jesús',
    'Belen',
    'Amelia',
  ];

  const totalEntries = Object.entries(payload).length;
  let currentCreated = 0;

  // for each entry in payload create user, user visits, events and charges
  for (const [key, charges] of Object.entries(payload)) {
    console.log(`Created ${currentCreated} of ${totalEntries} entries`);

    const visitsToCreate = [];

    // calculate amount of visits to create (it's between 0 - 7 visits)
    const numberOfVisits = Math.floor(Math.random() * 7);
    for (let i = 0; i < numberOfVisits; i++) {
      visitsToCreate.push({
        createdAt: new Date(2022, 1, Math.round(Math.random() * 30), 12, 12, 12),
      });
    }

    // calculate amount of events and charges to create
    const totalEvents = await prisma.event.count();
    const eventstoCreate = [];
    const chargesToCreate = [];
    for (let i = 0; i < charges.length; i++) {
      const { amount, lastEvent } = charges[i];

      eventstoCreate.push({
        sucursalId: 1,
        typeId: lastEvent.type === 'debit' ? 1 : 2,
      });

      chargesToCreate.push({
        amount,
        lastEventId: totalEvents + i + 1,
        createdAt: new Date(2022, 1, Math.round(Math.random() * 30), 12, 12, 12),
      });
    }

    await prisma.event.createMany({
      data: eventstoCreate,
    });

    // create new user with random name, also creates charges and visits by that user
    const randomName = Math.floor(Math.random() * names.length);
    await prisma.user.create({
      data: {
        firstName: key,
        lastName: names[randomName],
        createdAt: new Date(2022, 1, Math.round(Math.random() * 30)),
        charges: {
          createMany: { data: chargesToCreate },
        },
        visits: {
          createMany: { data: visitsToCreate },
        },
      },
    });

    currentCreated++;
  }
})()
  .catch((err) => console.error(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
