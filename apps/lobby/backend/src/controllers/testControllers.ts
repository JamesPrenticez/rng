// import { PrismaClient } from "@prisma/client";
import { type Request, type Response } from 'express';

// const prisma = new PrismaClient();

export const test = async (req: Request, res: Response): Promise<void> => {
  const BASE_URL = process.env.BASE_URL;

  try {
    res.status(200).json({
      data: {
        test: 'test',
        baseURL: BASE_URL,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'An error occurred while fetching habits',
    });
  }
};

// export const someData = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const test = await prisma.test.create({
//       data: {
//         someData: "test",
//       },
//     });

//     res.status(200).json({
//       test,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "An error occurred while testing",
//     });
//   }
// };
