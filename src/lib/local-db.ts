import { promises as fs } from "fs";
import path from "path";
import type { OrderStatus, PaymentMethod } from "@/types/commerce";

export type StoredOrder = {
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "PENDING" | "CONFIRMED" | "FAILED";
  subtotal: number;
  deliveryCost: number;
  discount: number;
  total: number;
  customerName: string;
  phone: string;
  email: string;
  region: string;
  city: string;
  digitalAddress?: string;
  streetAddress: string;
  deliveryNotes?: string;
  items: {
    productId: string;
    name: string;
    sku: string;
    quantity: number;
    price: number;
  }[];
  createdAt: string;
};

export type StoredQuote = {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  products: string;
  quantity?: string;
  projectType?: string;
  location?: string;
  message?: string;
  status: string;
  createdAt: string;
};

type DbFile = {
  orders: StoredOrder[];
  quotes: StoredQuote[];
  users: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    phone?: string;
    role: "CUSTOMER" | "ADMIN";
  }[];
};

const dbPath = path.join(process.cwd(), "data", "local-db.json");

async function readDb(): Promise<DbFile> {
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    return JSON.parse(raw) as DbFile;
  } catch {
    return { orders: [], quotes: [], users: [] };
  }
}

async function writeDb(db: DbFile) {
  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2), "utf8");
  } catch {
    // Vercel and other serverless hosts cannot persist the local JSON file.
  }
}

export async function saveOrder(order: StoredOrder) {
  const db = await readDb();
  db.orders.unshift(order);
  await writeDb(db);
  return order;
}

export async function findOrder(orderNumber: string, phoneOrEmail: string) {
  const db = await readDb();
  const needle = phoneOrEmail.toLowerCase().trim();
  return db.orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === orderNumber.toLowerCase().trim() &&
      (o.phone.includes(needle) || o.email.toLowerCase() === needle),
  );
}

export async function listOrders() {
  const db = await readDb();
  return db.orders;
}

export async function saveQuote(quote: Omit<StoredQuote, "id" | "createdAt" | "status">) {
  const db = await readDb();
  const entry: StoredQuote = {
    ...quote,
    id: `Q${Date.now()}`,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  db.quotes.unshift(entry);
  await writeDb(db);
  return entry;
}

export async function listQuotes() {
  const db = await readDb();
  return db.quotes;
}

export async function findUserByEmail(email: string) {
  const db = await readDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(user: DbFile["users"][number]) {
  const db = await readDb();
  db.users.push(user);
  await writeDb(db);
  return user;
}

export async function listCustomers() {
  const db = await readDb();
  return db.users.filter((u) => u.role === "CUSTOMER");
}

export async function syncAdminAccount(input: {
  email: string;
  name: string;
  passwordHash: string;
}) {
  const db = await readDb();
  db.users = db.users.filter((u) => u.role !== "ADMIN");
  db.users.push({
    id: "admin-1",
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    role: "ADMIN",
  });
  await writeDb(db);
}

export async function ensureAdminSeed(passwordHash: string) {
  const db = await readDb();
  if (!db.users.some((u) => u.role === "ADMIN")) {
    db.users.push({
      id: "admin-1",
      name: "IF NOT GOD ENT Admin",
      email: "ifnotgod@ent.com",
      passwordHash,
      role: "ADMIN",
    });
    await writeDb(db);
  }
}

export async function updateUserPasswordHash(email: string, passwordHash: string) {
  const db = await readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return;
  user.passwordHash = passwordHash;
  await writeDb(db);
}
