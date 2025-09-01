import express from "express";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/authmiddleware.js";
import { parseTransaction } from "../services/aiParser.js";
import { createTxnSchema, parseSchema } from "../utils/validators.js";

const router = express.Router();

// POST /api/transactions/parse
router.post("/parse", authRequired, async (req, res) => {
  try {
    const { text } = parseSchema.parse(req.body);
    const parsed = await parseTransaction(text);

    res.json({
      success: true,
      parsed: {
        amount: parsed.amount,
        category: parsed.category,
        description: parsed.description,
        confidence: parsed.confidence ?? 0.8,
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
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
    const tx = await prisma.transaction.updateMany({
      where: { id: req.params.id, userId: req.user.userId },
      data,
    });

    if (tx.count === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json({ message: "Updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/transactions/:id
router.delete("/:id", authRequired, async (req, res) => {
  const tx = await prisma.transaction.deleteMany({
    where: { id: req.params.id, userId: req.user.userId },
  });

  if (tx.count === 0) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json({ message: "Deleted" });
});

export default router;
