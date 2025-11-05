import express from "express";
const router = express.Router();

const PROMO_CODES = {
  SAVE10: { type: "percent", value: 10 },
  FLAT100: { type: "flat", value: 100 },
};

router.post("/validate", (req, res) => {
  const { code, amount } = req.body;
  const promo = PROMO_CODES[code];
  if (!promo) return res.json({ valid: false, message: "Invalid promo code" });

  let newAmount = amount;
  if (promo.type === "percent") newAmount = amount - (amount * promo.value) / 100;
  else if (promo.type === "flat") newAmount = amount - promo.value;

  if (newAmount < 0) newAmount = 0;
  res.json({ valid: true, newAmount, discountType: promo.type, value: promo.value });
});

export default router;
