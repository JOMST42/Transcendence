import { PrismaClient } from '@prisma/client';

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

async function main() {
  console.log(`Start seeding ...`);
  // for (const w of weatherData) {
  //   const weather = await prisma.weather.create({
  //     data: w,
  //   });
  //   console.log(`Created weather with id: ${weather.id}`);
  // }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
