import { Router } from "express";
import { z } from "zod";
import prisma from "../prisma";
import { userSchema } from "../validators/user";

const router = Router();

/**
 * root router, only for test server
 */
router.get("/status", async (req, res) => {
  res.send("User Management API is running!");
});

/**
 * get all users(support order + search)
 * parameters:
 * -sortBy: (customerNumber, username, firstName, lastName, lastLogin)
 * -order: ('asc' or 'desc')
 * -search: (keyword)
 * default: 'customerNumber', 'asc', ''
 */
router.get("/", async (req, res) => {
  const sortBy = (req.query.sortBy as string) || "customerNumber";
  const order = (req.query.order as string) === "desc" ? "desc" : "asc";
  const search = (req.query.search as string) || "";

  try {
    const orConditions = [
      !isNaN(Number(search))
        ? { customerNumber: { equals: Number(search) } }
        : undefined,
      { username: { contains: search, mode: "insensitive" as const } },
      { firstName: { contains: search, mode: "insensitive" as const } },
      { lastName: { contains: search, mode: "insensitive" as const } },
      { email: { contains: search, mode: "insensitive" as const } },
    ].filter(Boolean) as any;

    const users = await prisma.user.findMany({
      where: search ? { OR: orConditions } : {},
      orderBy: { [sortBy]: order },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

/**
  * get single use by id
  */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});


/**
 * add new user
 */
router.post("/", async (req, res) => {

  try {
    const validated = userSchema.parse(req.body);

    const newUser = await prisma.user.create({
      data: validated,
    });

    res.status(201).json(newUser);
  } catch (err) {
    if (err instanceof z.ZodError) {
  console.error("Validation error:", err.issues);
  res.status(400).json({ error: "Invalid user data", details: err.issues });
} else {
  console.error("Prisma Error:", err);
  res.status(500).json({ error: "Failed to create user" });
}

  }
});

/**
 * update user
*/
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updateSchema = userSchema.partial();
    const validated = updateSchema.parse(req.body);

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: validated,
    });

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid user data", details: err.issues });
    }
    console.error("Update user error:", err);
    res.status(400).json({ error: "User not found or update failed" });
  }
});


/**
 * delete user
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: "User deleted successfully" });
  } catch {
    res.status(400).json({ error: "User not found" });
  }
});
export default router;