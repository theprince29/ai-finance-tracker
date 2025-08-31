import express from "express";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", authRequired, async (req, res) => {
  const txs = await prisma.transaction.findMany({
    where: { userId: req.user.userId },
  });
  const income = txs.filter(t => t.type === "INCOME").reduce((a, b) => a + b.amount, 0);
  const expenses = txs.filter(t => t.type === "EXPENSE").reduce((a, b) => a + b.amount, 0);
  res.json({
    income,
    expenses,
    savings: income - expenses,
  });
});

router.get("/categories", authRequired, async (req, res) => {
  const txs = await prisma.transaction.groupBy({
    by: ["category"],
    where: { userId: req.user.userId },
    _sum: { amount: true },
  });
  res.json(txs);
});

router.get("/trends", authRequired, async (req, res) => {
  const txs = await prisma.transaction.findMany({
    where: { userId: req.user.userId },
    orderBy: { occurredAt: "asc" },
  });
  res.json(txs);
});

export default router;
