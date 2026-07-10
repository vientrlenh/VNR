import { getUserByEmail } from "../repositories/userRepository.js";

export async function login(email: string, password: string) {
    const user = await getUserByEmail(email);
    if (!user || user.password !== password) {
        return null;
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
}
