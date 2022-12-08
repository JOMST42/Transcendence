import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const gamesToSeed = 150;
// let users: User[];
// let games: Game[];

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
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

async function main() {
  console.log(`Start seeding ...`);
  // await seedUsers();
  // await seedGames();
  // await seedFriends();
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
          email: 'sfournie@student.42quebec.com',
          displayName: 'Fousse',
          normalizedName: 'fousse',
          firstName: 'Sébastien',
          lastName: 'Fournier',
        },
        {
          username: 'mleblanc',
          email: 'mleblanc@student.42quebec.com',
          displayName: 'mikastiv',
          normalizedName: 'mikastiv',
          firstName: 'Michael',
          lastName: 'Leblanc',
        },
        {
          username: 'jbadia',
          email: 'jbadia@student.42quebec.com',
          displayName: 'Just_in_case',
          normalizedName: 'just_in_case',
          firstName: 'Justine',
          lastName: 'Badia',
        },
        {
          username: 'olabrecq',
          email: 'olabrecq@student.42quebec.com',
          displayName: 'sheSaidOlalaOli',
          normalizedName: 'shesaidolalaoli',
          firstName: 'Olivier',
          lastName: 'Lala',
        },
        {
          username: 'pirichar',
          email: 'pirichar@student.42quebec.com',
          displayName: 'PisRichard',
          normalizedName: 'pisrichard',
          firstName: 'Pier-luc',
          lastName: 'ichard',
        },
        {
          username: 'tblanco',
          email: 'tblanco@student.42quebec.com',
          displayName: 'BigBlanco',
          normalizedName: 'bigblanco',
          firstName: 'Teddy',
          lastName: 'Blanco',
        },
        {
          username: 'gcollet',
          email: 'gcollet@student.42quebec.com',
          displayName: 'poutineStJean',
          normalizedName: 'poutinestjean',
          firstName: 'Gabriel',
          lastName: 'Collet',
        },
        {
          username: 'hbanthiy',
          email: 'hbanthiy@student.42quebec.com',
          displayName: 'LovingIndianDad',
          normalizedName: 'lovingindiandad',
          firstName: 'Harsh',
          lastName: 'Bant',
        },
      ],
      skipDuplicates: true,
    })
    .catch((e) => {
      // console.log(e);
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
        // console.log(e);
      });
  }
}

async function seedFriends() {
  const prismaUsers = await prisma.user.findMany();
  const range = prismaUsers.length;
  let i = 0;
  let j = 0;

  for (i = 0; i < prismaUsers.length; i++) {
    for (j = i + 1; j < prismaUsers.length; j += 2) {
      await prisma.friendship
        .create({
          data: {
            requesterId: prismaUsers[i].id,
            adresseeId: prismaUsers[j].id,
            accepted: Math.random() > 0.5 ? true : false,
            adresseeBlocker: Math.random() > 0.8 ? true : false,
            requesterBlocker: Math.random() > 0.8 ? true : false,
          },
        })
        .catch((e) => {
          // console.log(e);
        });
    }
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
