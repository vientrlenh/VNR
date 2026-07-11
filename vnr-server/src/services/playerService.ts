import { getCurrentGame } from "../repositories/gameRepository.js";
import { createPlayer, getPlayerByNickname } from "../repositories/playerRepository.js";

export async function joinGame(nickname: string) {
    const game = await getCurrentGame();
    if (!game) {
        return { ok: false as const, status: 400, message: "Chưa có game nào được tạo" };
    }

    const existing = await getPlayerByNickname(game.id, nickname);
    if (existing) {
        return { ok: false as const, status: 409, message: "Tên đã được sử dụng, hãy chọn tên khác" };
    }

    const player = await createPlayer(game.id, nickname);
    return { ok: true as const, player };
}
