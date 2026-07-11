import jwt, { type SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || ""

export interface JwtPayload {
    userId: number
    email: string
}

export function signToken(userId: number, email: string): string {
    if (JWT_SECRET === "") {
        throw new Error("JWT_SECRET is not defined")
    }
    const payload: JwtPayload = {
        userId: userId, 
        email: email
    }
    const options: SignOptions = { expiresIn: '24h' }
    return jwt.sign(payload, JWT_SECRET, options)
}

export function verifyToken(token: string): JwtPayload { 
    return jwt.verify(token, JWT_SECRET) as JwtPayload
}
