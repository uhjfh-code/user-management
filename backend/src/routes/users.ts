import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/**
 * root router, only for test server
 */
router.get("/status", async(req, res)=>{
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
  router.get("/:id", async(req, res)=>{
    const {id} = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: {id: Number(id)}
      });

      if(!user){
        return res.status(404).json({error: "User not found"});
      }

      res.status(200).json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({error: "Failed to fetch user"});
    }
 });


 /**
  * add new user
  */
router.post("/", async(req, res)=>{
    try {
        const {
          customerNumber,
          username,
          firstName,
          lastName,
          email,
          dateOfBirth,
          password
        } = req.body;

        const user = await prisma.user.create({
          data: {
            customerNumber: Number(customerNumber),
            username,
            firstName,
            lastName,
            email,
            dateOfBirth: new Date(dateOfBirth),
            password
        },
      });
        res.status(200).json(user);
    } catch (err) {
      console.error("Prisma Error: ", err);
        res.status(400).json({error: "Failed to create user", details: err});
    }
});

 /**
  * update user
 */
router.put("/:id", async(req, res)=>{
    const {id} = req.params;
    try {
        const {
          customerNumber,
          username,
          firstName,
          lastName,
          email,
          dateOfBirth,
          password,
          lastLogin
        } =req.body;

        const updated = await prisma.user.update({
            where:{id: Number(id)},
            data: {
              customerNumber: Number(customerNumber),
              username,
              firstName,
              lastName,
              email,
              dateOfBirth: new Date(dateOfBirth),
              password,
              lastLogin: lastLogin ? new Date(lastLogin) : undefined
            },
        });
        res.json(updated);
    } catch(err){
      console.error("Update user error: ", err);
      res.status(400).json({error: "User not found", details: err});
    }
});


/**
 * delete user
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