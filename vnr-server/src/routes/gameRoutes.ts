import { Router, type Response } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";
import { getCurrentGameForHost } from "../repositories/gameRepository.js";

const router: Router = Router();

router.get("/current", requireAuth, async (req: AuthedRequest, res: Response) => {
    const game = await getCurrentGameForHost(req.user!.userId);
    if (!game) {
        return res.status(404).send({ message: "Chưa có game nào được tạo" });
    }

    res.send({ gameId: game.id, name: game.name });
});

export default router;
