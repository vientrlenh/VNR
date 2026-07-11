import { Router, type Request, type Response } from "express";
import { joinGame } from "../services/playerService.js";

const router: Router = Router();

router.post("/join", async (req: Request, res: Response) => {
    const nickname = typeof req.body?.nickname === "string" ? req.body.nickname.trim() : "";

    if (!nickname) {
        return res.status(400).send({ message: "Nickname là bắt buộc" });
    }

    const result = await joinGame(nickname);
    if (!result.ok) {
        return res.status(result.status).send({ message: result.message });
    }

    res.send({
        playerId: result.player.id,
        gameId: result.player.gameId,
        nickname: result.player.nickname
    });
});

export default router;
