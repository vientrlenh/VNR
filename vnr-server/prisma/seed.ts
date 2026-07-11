import 'dotenv/config'
import { prisma } from '../src/lib/prisma.js'

const HOST_EMAIL = 'host@vnr.local'
const HOST_PASSWORD = 'vnr2026'
const GAME_NAME = 'Cong cuoc Doi moi - Dai hoi VIII & IX'

interface SeedOption {
    content: string
    isCorrect: boolean
}

interface SeedQuestion {
    title: string
    type: 'SINGLE'
    timeLimitSec: number
    options: SeedOption[]
}

const questions: SeedQuestion[] = [
    // Phần a: Đại hội VIII (1996) — bước đầu thực hiện CNH, HĐH
    {
        title: 'Đại hội đại biểu toàn quốc lần thứ VIII của Đảng diễn ra vào năm nào?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: '1991', isCorrect: false },
            { content: '1996', isCorrect: true },
            { content: '2001', isCorrect: false },
            { content: '2006', isCorrect: false },
        ],
    },
    {
        title: 'Đại hội VIII nhận định đất nước đã ra khỏi khủng hoảng kinh tế - xã hội và chuyển sang thời kỳ nào?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: 'Đẩy mạnh công nghiệp hóa, hiện đại hóa đất nước', isCorrect: true },
            { content: 'Cải cách ruộng đất', isCorrect: false },
            { content: 'Khôi phục kinh tế sau chiến tranh', isCorrect: false },
            { content: 'Xây dựng nền kinh tế kế hoạch hóa tập trung', isCorrect: false },
        ],
    },
    {
        title: 'Theo Đại hội VIII, mục tiêu phấn đấu đến năm 2020 là gì?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: 'Đưa nước ta cơ bản trở thành một nước công nghiệp theo hướng hiện đại', isCorrect: true },
            { content: 'Hoàn thành xóa đói giảm nghèo trên toàn quốc', isCorrect: false },
            { content: 'Gia nhập Tổ chức Thương mại Thế giới (WTO)', isCorrect: false },
            { content: 'Hoàn thành công nghiệp hóa nông nghiệp, nông thôn', isCorrect: false },
        ],
    },
    {
        title: 'Đại hội VIII xác định công nghiệp hóa, hiện đại hóa là sự nghiệp của ai?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: 'Chỉ riêng thành phần kinh tế nhà nước', isCorrect: false },
            { content: 'Toàn dân, của mọi thành phần kinh tế, trong đó kinh tế nhà nước giữ vai trò chủ đạo', isCorrect: true },
            { content: 'Chỉ các doanh nghiệp có vốn đầu tư nước ngoài', isCorrect: false },
            { content: 'Chỉ riêng giai cấp công nhân', isCorrect: false },
        ],
    },
    {
        title: 'Theo quan điểm về công nghiệp hóa, hiện đại hóa tại Đại hội VIII, yếu tố nào được xác định là động lực của công nghiệp hóa, hiện đại hóa?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: 'Khoa học và công nghệ', isCorrect: true },
            { content: 'Vốn đầu tư nước ngoài', isCorrect: false },
            { content: 'Xuất khẩu tài nguyên thiên nhiên', isCorrect: false },
            { content: 'Lao động giá rẻ', isCorrect: false },
        ],
    },

    // Phần b: Đại hội IX (2001) — tiếp tục thực hiện CNH, HĐH đất nước
    {
        title: 'Đại hội đại biểu toàn quốc lần thứ IX của Đảng diễn ra vào năm nào?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: '1996', isCorrect: false },
            { content: '2001', isCorrect: true },
            { content: '2006', isCorrect: false },
            { content: '2011', isCorrect: false },
        ],
    },
    {
        title: 'Đại hội IX xác định mô hình kinh tế tổng quát trong thời kỳ quá độ lên chủ nghĩa xã hội ở Việt Nam là gì?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: 'Kinh tế kế hoạch hóa tập trung', isCorrect: false },
            { content: 'Kinh tế thị trường tự do hoàn toàn', isCorrect: false },
            { content: 'Kinh tế thị trường định hướng xã hội chủ nghĩa', isCorrect: true },
            { content: 'Kinh tế hỗn hợp nhà nước - tư nhân cân bằng', isCorrect: false },
        ],
    },
    {
        title: 'Đại hội IX xác định nền tảng tư tưởng của Đảng là gì?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: 'Chủ nghĩa Mác - Lênin và tư tưởng Hồ Chí Minh', isCorrect: true },
            { content: 'Chỉ riêng chủ nghĩa Mác - Lênin', isCorrect: false },
            { content: 'Chỉ riêng tư tưởng Hồ Chí Minh', isCorrect: false },
            { content: 'Chủ nghĩa Mác - Lênin và tư tưởng Tôn Trung Sơn', isCorrect: false },
        ],
    },
    {
        title: 'Chiến lược phát triển kinh tế - xã hội do Đại hội IX đề ra áp dụng cho giai đoạn nào?',
        type: 'SINGLE',
        timeLimitSec: 20,
        options: [
            { content: '1996 - 2000', isCorrect: false },
            { content: '2001 - 2010', isCorrect: true },
            { content: '2001 - 2015', isCorrect: false },
            { content: '2005 - 2020', isCorrect: false },
        ],
    },
]

async function main() {
    const host = await prisma.user.upsert({
        where: { email: HOST_EMAIL },
        update: {},
        create: {
            email: HOST_EMAIL,
            password: HOST_PASSWORD,
            name: 'Host demo',
        },
    })

    const game = await prisma.game.upsert({
        where: { name: GAME_NAME },
        update: {},
        create: {
            name: GAME_NAME,
            hostId: host.id,
        },
    })

    await prisma.playerAnswer.deleteMany({})
    await prisma.option.deleteMany({})
    await prisma.question.deleteMany({})

    for (const q of questions) {
        const correctIndex = q.options.findIndex((o) => o.isCorrect)
        await prisma.question.create({
            data: {
                title: q.title,
                type: q.type,
                timeLimitSec: q.timeLimitSec,
                correctAns: correctIndex + 1,
                options: {
                    create: q.options.map((o) => ({
                        content: o.content,
                        isCorrect: o.isCorrect,
                    })),
                },
            },
        })
    }

    console.log(`Seed xong: host=${HOST_EMAIL}/${HOST_PASSWORD}, game="${GAME_NAME}" (id=${game.id}), ${questions.length} câu hỏi.`)
}

main()
    .catch((err) => {
        console.error(err)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
