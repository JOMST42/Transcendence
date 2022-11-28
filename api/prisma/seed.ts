import { Game, Prisma, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

// const weatherData: Prisma.WeatherCreateInput[] = [
//   {
//     value: '123C',
//   },
//   {
//     value: '122C',
//   },
//   {
//     value: '121C',
//     description: 'Hot',
//   },
//   {
//     value: '1C',
//   },
//   {
//     value: '10C',
//   },
// ];
const gamesToSeed = 500;
let users: User[];
let games: Game[];

async function main() {
  console.log(`Start seeding ...`);
  await seedUsers();
  await seedGames();
  // for (const w of weatherData) {
  //   const weather = await prisma.weather.create({
  //     data: w,
  //   });
  //   console.log(`Created weather with id: ${weather.id}`);
  // }
  console.log(`Seeding finished.`);
}

async function seedUsers() {
  await prisma.user
    .createMany({
      data: [
        {
          username: 'sfournie',
          email: 'foussy@gmail.com',
          displayName: 'Fousse',
          normalizedName: 'fousse',
          firstName: 'Sébastien',
          lastName: 'Fournier',
        },
        {
          username: 'mleblanc',
          email: 'leblanc@gmail.com',
          displayName: 'mikastiv',
          normalizedName: 'mikastiv',
          firstName: 'Michael',
          lastName: 'Leblanc',
        },
        {
          username: 'jbadia',
          email: 'badia@gmail.com',
          displayName: 'Just_in_case',
          normalizedName: 'just_in_case',
          firstName: 'Justine',
          lastName: 'Badia',
        },
        {
          username: 'olabrecq',
          email: 'olala@gmail.com',
          displayName: 'sheSaidOlalaOli',
          normalizedName: 'shesaidolalaoli',
          firstName: 'Olivier',
          lastName: 'Lala',
        },
      ],
    })
    .catch((e) => {
      console.log(e);
    });
}

async function seedGames() {
  const prismaUsers = await prisma.user.findMany();
  const range = prismaUsers.length;

  if (range === 0) return;

  let i = 0;
  for (i = 0; i < gamesToSeed; i++) {
    const id1 = prismaUsers[Math.trunc(Math.random() * prismaUsers.length)].id;
    let id2 = prismaUsers[Math.trunc(Math.random() * prismaUsers.length)].id;
    while (id2 === id1)
      id2 = prismaUsers[Math.trunc(Math.random() * prismaUsers.length)].id;
    await prisma.game
      .create({
        data: {
          timePlayed: Math.random() * 100,
          player1Id: id1,
          player2Id: id2,
          winner: Math.trunc(Math.random() * 2) === 1 ? 'PLAYER1' : 'PLAYER2',
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

// async function seedGames() {
//   games = this.prisma.createMany({
//     data: [
//       {
//         username: 'sfournie',
//         email: 'foussy@gmail.com',
//         displayName: 'Fousse',
//         normalizedName: 'fousse',
//         firstName: 'Sébastien',
//         lastName: 'Fournier',
//       },
//       {
//         username: 'mleblanc',
//         email: 'leblanc@gmail.com',
//         displayName: '',
//         normalizedName: 'fousse',
//         firstName: 'Michael',
//         lastName: 'Leblanc',
//       },
//       {
//         username: 'jbadia',
//         email: 'badia@gmail.com',
//         displayName: 'Just_in_case',
//         normalizedName: 'just_in_case',
//         firstName: 'Justine',
//         lastName: 'Badia',
//       },
//       {
//         username: 'olabrecq',
//         email: 'olala@gmail.com',
//         displayName: 'sheSaidOlalaOli',
//         normalizedName: 'shesaidolalaoli',
//         firstName: 'Olivier',
//         lastName: 'Lala',
//       },
//     ],
//   });
// }

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
