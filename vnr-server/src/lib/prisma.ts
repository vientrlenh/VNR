import 'dotenv/config'
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from '../../generated/prisma/client.js';

const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST || 'localhost:3306', 
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || '', 
    database: process.env.DB_NAME || 'vnr',
    connectionLimit: 5
})

const prisma = new PrismaClient({ adapter })

export { prisma }
