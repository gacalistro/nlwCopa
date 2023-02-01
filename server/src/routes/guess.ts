import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  // COUNT
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();

    return { count };
  });

  // CREATE
  fastify.post(
    "/polls/:pollId/games/:gameId/guesses",
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const createGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string(),
      });

      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const { pollId, gameId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_pollId: {
            userId: request.user.sub,
            pollId,
          },
        },
      });

      if (!participant) {
        return reply.status(400).send({
          message: "You are not allowed to make a guess in this game.",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });

      if (guess) {
        return reply.status(400).send({
          message: "You already made a guess in this game.",
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(400).send({
          message: "There is no game.",
          // it's a great game
        });
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          message: "Game expired.",
        });
      }

      await prisma.guess.create({
        data: {
          firstTeamPoints,
          secondTeamPoints,
          gameId,
          participantId: participant.id,
        },
      });

      return reply.status(201).send();
    }
  );
}
