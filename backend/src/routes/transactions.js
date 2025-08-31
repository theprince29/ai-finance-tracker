import express from "express";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/auth.js";
import { parseTransaction } from "../services/aiParser.js";
import { createTxnSchema, parseSchema } from "../utils/validators.js";

const router = express.Router();

// POST /api/transactions/parse
router.post("/parse", authRequired, async (req, res) => {
  try {
    const { text } = parseSchema.parse(req.body);
    const parsed = await parseTransaction(text);
    res.json(parsed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/transactions
router.post("/", authRequired, async (req, res) => {
  try {
    const data = createTxnSchema.parse(req.body);
    const tx = await prisma.transaction.create({
      data: {
        ...data,
        userId: req.user.userId,
      },
    });
    res.json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/transactions
router.get("/", authRequired, async (req, res) => {
  const txs = await prisma.transaction.findMany({
    where: { userId: req.user.userId },
    orderBy: { occurredAt: "desc" },
  });
  res.json(txs);
});

// PUT /api/transactions/:id
router.put("/:id", authRequired, async (req, res) => {
  try {
    const data = createTxnSchema.parse(req.body);
    const tx = await prisma.transaction.update({
      where: { id: req.params.id },
      data,
    });
    res.json(tx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete("/:id", authRequired, async (req, res) => {
  await prisma.transaction.delete({
    where: { id: req.params.id },
  });
  res.json({ message: "Deleted" });
});

export default router;
