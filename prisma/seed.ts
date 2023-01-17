import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const passwordAdmin = await hash("admin", 12);
    const passwordUser = await hash("gustavo", 12);

    const userData: Prisma.UserCreateInput[] = [
        {
            name: "Admin",
            lastName: "Administrator",
            email: "admin@admin.com",
            password: passwordAdmin,
            role: "ADMIN",
        },
        {
            name: "Gustavo",
            lastName: "Goulart",
            email: "gustavo@gmail.com",
            password: passwordUser,
            role: "USER",
        },
    ];
    console.log(`Start seeding ...`);

    // eslint-disable-next-line no-restricted-syntax
    for (const u of userData) {
        //   eslint-disable-next-line no-await-in-loop
        const user = await prisma.user.create({
            data: u,
        });

        console.log(`Created user with id: ${user.id}`);
    }

    const tag1 = await prisma.tag.create({
        data: {
            name: "serie a",
        },
    });

    const tag2 = await prisma.tag.create({
        data: {
            name: "serie b",
        },
    });

    const tag3 = await prisma.tag.create({
        data: {
            name: "serie C",
        },
    });

    const course1 = await prisma.course.create({
        data: {
            name: "Sistemas de Informação",
            schoolLevel: "SUPERIOR",
        },
    });

    const course2 = await prisma.course.create({
        data: {
            name: "Informática",
            schoolLevel: "ENSINO_MEDIO",
        },
    });

    const class1 = await prisma.class.create({
        data: {
            name: "1º Período",
            courseId: course1.id,
        },
    });

    const class2 = await prisma.class.create({
        data: {
            name: "1ª Série",
            courseId: course2.id,
        },
    });

    const category1 = await prisma.category.create({
        data: {
            name: "Texto dos alunos",
        },
    });

    const category2 = await prisma.category.create({
        data: {
            name: "Texto dos professores",
        },
    });

    const category3 = await prisma.category.create({
        data: {
            name: "Texto identidade",
        },
    });

    const genre1 = await prisma.textualGenre.create({
        data: {
            name: "Narrativa",
        },
    });

    const genre2 = await prisma.textualGenre.create({
        data: {
            name: "Notícia",
        },
    });

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
