import express from "express";
import cors from "cors";
import userRouter from "./routes/users";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});

