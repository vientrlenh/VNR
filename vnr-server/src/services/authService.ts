import { signToken } from "../lib/jwt.js";
import { getUserByEmail } from "../repositories/userRepository.js";

export async function login(email: string, password: string) {
    const user = await getUserByEmail(email);
    if (!user || user.password !== password) {
        return null;
    }
    var token = signToken(user.id, user.email)
    return token;
}
