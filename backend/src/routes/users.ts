import { Router } from "express";
import prisma from "../prisma";

const router = Router();

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
  * add new user
  */
router.post("/", async(req, res)=>{
    try {
        const user = await prisma.user.create({data: req.body});
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({error: "Failed to create user", details: err});
    }
});


 /**
  * update user
 */
router.put("/:id", async(req, res)=>{
    const {id} = req.params;
    try {
        const updated = await prisma.user.update({
            where:{id: Number(id)},
            data: req.body,
        });
        res.json(updated);
    } catch{
        res.status(400).json({error: "User not found"});
    }
});

/**
 *  delete user
 */
router.delete("/:id", async(req, res)=>{
    const {id} = req.params;
    try {
        await prisma.user.delete({where: {id: Number(id)}});
        res.json({message: "User deleted successfully"});
    } catch {
        res.status(400).json({error: "User not found"});
    }
});
export default router;