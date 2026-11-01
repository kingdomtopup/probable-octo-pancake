import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  VerifyPlayerIdBody,
  GetProductsQueryParams,
  CreateOrderBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const MLBB_PRODUCTS = [
  { id: "mlbb-11", name: "11 ពេជ្រ", amount: 11, price: 0.27, currency: "USD", bonus: "" },
  { id: "mlbb-22", name: "22 ពេជ្រ", amount: 22, price: 0.54, currency: "USD", bonus: "" },
  { id: "mlbb-56", name: "56 ពេជ្រ", amount: 56, price: 1.09, currency: "USD", bonus: "" },
  { id: "mlbb-112", name: "112 ពេជ្រ", amount: 112, price: 2.18, currency: "USD", bonus: "+6 Bonus" },
  { id: "mlbb-172", name: "172 ពេជ្រ", amount: 172, price: 3.27, currency: "USD", bonus: "+12 Bonus" },
  { id: "mlbb-257", name: "257 ពេជ្រ", amount: 257, price: 4.90, currency: "USD", bonus: "+17 Bonus" },
  { id: "mlbb-343", name: "343 ពេជ្រ", amount: 343, price: 6.54, currency: "USD", bonus: "+22 Bonus" },
  { id: "mlbb-514", name: "514 ពេជ្រ", amount: 514, price: 9.81, currency: "USD", bonus: "+36 Bonus" },
  { id: "mlbb-706", name: "706 ពេជ្រ", amount: 706, price: 13.08, currency: "USD", bonus: "+48 Bonus" },
  { id: "mlbb-878", name: "878 ពេជ្រ", amount: 878, price: 16.35, currency: "USD", bonus: "+60 Bonus" },
  { id: "mlbb-1412", name: "1412 ពេជ្រ", amount: 1412, price: 26.17, currency: "USD", bonus: "+98 Bonus" },
  { id: "mlbb-2195", name: "2195 ពេជ្រ", amount: 2195, price: 40.89, currency: "USD", bonus: "+150 Bonus" },
  { id: "mlbb-3688", name: "3688 ពេជ្រ", amount: 3688, price: 65.44, currency: "USD", bonus: "+302 Bonus" },
  { id: "mlbb-weekly", name: "Weekly Diamond Pass", amount: 0, price: 0.99, currency: "USD", bonus: "70 ពេជ្រ/អាទិត្យ" },
  { id: "mlbb-monthly", name: "Twilight Pass", amount: 0, price: 3.27, currency: "USD", bonus: "500+ ពេជ្រ" },
];

const FREEFIRE_PRODUCTS = [
  { id: "ff-25", name: "25 ពេជ្រ", amount: 25, price: 0.27, currency: "USD", bonus: "" },
  { id: "ff-50", name: "50 ពេជ្រ", amount: 50, price: 0.54, currency: "USD", bonus: "" },
  { id: "ff-100", name: "100 ពេជ្រ", amount: 100, price: 1.09, currency: "USD", bonus: "" },
  { id: "ff-210", name: "210 ពេជ្រ", amount: 210, price: 2.18, currency: "USD", bonus: "+10 Bonus" },
  { id: "ff-530", name: "530 ពេជ្រ", amount: 530, price: 5.45, currency: "USD", bonus: "+30 Bonus" },
  { id: "ff-1060", name: "1060 ពេជ្រ", amount: 1060, price: 10.90, currency: "USD", bonus: "+60 Bonus" },
  { id: "ff-2180", name: "2180 ពេជ្រ", amount: 2180, price: 21.80, currency: "USD", bonus: "+180 Bonus" },
  { id: "ff-5600", name: "5600 ពេជ្រ", amount: 5600, price: 54.90, currency: "USD", bonus: "+600 Bonus" },
  { id: "ff-weekly", name: "Weekly Member", amount: 0, price: 1.09, currency: "USD", bonus: "100 ពេជ្រ/អាទិត្យ" },
  { id: "ff-monthly", name: "Monthly Member", amount: 0, price: 4.36, currency: "USD", bonus: "400+ ពេជ្រ" },
];

const LICENSE_PRODUCTS = [
  { id: "ml-license-1m", name: "License 1 ខែ", amount: 1, price: 4.90, currency: "USD", bonus: "Mobile Legend License" },
  { id: "ml-license-3m", name: "License 3 ខែ", amount: 3, price: 13.60, currency: "USD", bonus: "Mobile Legend License" },
  { id: "ml-license-6m", name: "License 6 ខែ", amount: 6, price: 26.17, currency: "USD", bonus: "Mobile Legend License" },
  { id: "ml-license-1y", name: "License 1 ឆ្នាំ", amount: 12, price: 49.00, currency: "USD", bonus: "Mobile Legend License" },
];

router.post("/topup/verify-id", async (req, res) => {
  const parseResult = VerifyPlayerIdBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "INVALID_REQUEST", message: "Invalid request body" });
    return;
  }

  const { game, playerId, serverId } = parseResult.data;

  if (!playerId || playerId.trim() === "") {
    res.status(400).json({ error: "INVALID_ID", message: "Player ID is required" });
    return;
  }

  if (game === "mlbb" && (!serverId || serverId.trim() === "")) {
    res.status(400).json({ error: "INVALID_SERVER", message: "Server ID is required for MLBB" });
    return;
  }

  const playerNames: Record<string, string> = {
    mlbb: "MLBB Player",
    freefire: "Free Fire Player",
    license: "MLBB Player",
  };

  res.json({
    valid: true,
    playerName: playerNames[game] || "Player",
    playerId,
    serverId: serverId || "",
  });
});

router.get("/topup/products", async (req, res) => {
  const parseResult = GetProductsQueryParams.safeParse(req.query);
  if (!parseResult.success) {
    res.status(400).json({ error: "INVALID_REQUEST", message: "Invalid game parameter" });
    return;
  }

  const { game } = parseResult.data;

  let products;
  if (game === "mlbb") {
    products = MLBB_PRODUCTS;
  } else if (game === "freefire") {
    products = FREEFIRE_PRODUCTS;
  } else {
    products = LICENSE_PRODUCTS;
  }

  res.json({ game, products });
});

router.post("/orders", async (req, res) => {
  const parseResult = CreateOrderBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "INVALID_REQUEST", message: "Invalid order data" });
    return;
  }

  const data = parseResult.data;

  const [order] = await db.insert(ordersTable).values({
    game: data.game,
    playerId: data.playerId,
    serverId: data.serverId || null,
    playerName: data.playerName || null,
    productId: data.productId,
    productName: null,
    amount: String(data.amount),
    price: String(data.price),
    status: "pending",
    transactionId: data.transactionId || null,
  }).returning();

  res.status(201).json({
    ...order,
    amount: Number(order.amount),
    price: Number(order.price),
  });
});

router.get("/orders", async (_req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  res.json(orders.map(o => ({
    ...o,
    amount: Number(o.amount),
    price: Number(o.price),
  })));
});

export default router;
