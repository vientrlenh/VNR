import { Router, type Request, type Response } from "express";
import { login } from "../services/authService.js";

const router: Router = Router();

router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: "Email và mật khẩu là bắt buộc" });
    }

    const user = await login(email, password);
    if (!user) {
        return res.status(401).send({ message: "Email hoặc mật khẩu không đúng" });
    }

    res.send({ user });
});

export default router;
