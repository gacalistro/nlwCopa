import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      avatarUrl:
        "https://lh3.googleusercontent.com/a/ALm5wu1svbj-wd2xLAu1gkRrzxG_VDtL5X4dfk5bW7CBiw=s96-c",
      googleId: "112854148357457398189",
    },
  });

  const poll = await prisma.poll.create({
    data: {
      title: "First poll",
      code: "POL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2023-08-30T00:00:00.000Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "HR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2023-08-30T00:00:00.000Z",
      firstTeamCountryCode: "BR",
      secondTeamCountryCode: "CM",

      guesses: {
        create: {
          firstTeamPoints: 0,
          secondTeamPoints: 1,
          participant: {
            connect: {
              userId_pollId: {
                pollId: poll.id,
                userId: user.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
