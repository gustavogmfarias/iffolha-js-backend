import { PrismaClient, Prisma } from "@prisma/client";
import { hash } from "bcryptjs";
import { ArticleRepository } from "../src/modules/articles/repositories/infra/ArticleRepository";

const prisma = new PrismaClient();
const articleRepository = new ArticleRepository();
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
    //   eslint-disable-next-line no-await-in-loop
    const admin = await prisma.user.create({
        data: userData[0],
    });
    const user = await prisma.user.create({
        data: userData[1],
    });

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

    const article1 = await prisma.article.create({
        data: {
            title: "Minha notícia",
            subTitle: "Uma notica nova",
            content: "Nova notícia",
            publishedByUserId: user.id,
            isHighlight: true,
            url: articleRepository.generateUrl("Minha notícia"),
            TagsOnArticles: {
                create: [
                    {
                        tag: {
                            connect: {
                                id: tag1.id,
                            },
                        },
                    },
                    {
                        tag: {
                            connect: {
                                id: tag2.id,
                            },
                        },
                    },
                    {
                        tag: {
                            connect: {
                                id: tag3.id,
                            },
                        },
                    },
                ],
            },
            CoursesOnArticles: {
                create: [
                    {
                        course: {
                            connect: {
                                id: course1.id,
                            },
                        },
                    },
                    {
                        course: {
                            connect: {
                                id: course2.id,
                            },
                        },
                    },
                ],
            },
            ClassOnArticles: {
                create: [
                    {
                        class: {
                            connect: {
                                id: class1.id,
                            },
                        },
                    },
                    {
                        class: {
                            connect: {
                                id: class2.id,
                            },
                        },
                    },
                ],
            },
            CategoryOnArticles: {
                create: [
                    {
                        category: {
                            connect: {
                                id: category1.id,
                            },
                        },
                    },
                    {
                        category: {
                            connect: {
                                id: category2.id,
                            },
                        },
                    },
                    {
                        category: {
                            connect: {
                                id: category3.id,
                            },
                        },
                    },
                ],
            },
            TextualGenreOnArticles: {
                create: [
                    {
                        textualGenre: {
                            connect: {
                                id: genre1.id,
                            },
                        },
                    },
                    {
                        textualGenre: {
                            connect: {
                                id: genre2.id,
                            },
                        },
                    },
                ],
            },
        },
    });
    const article2 = await prisma.article.create({
        data: {
            title: "Minha notícia 2",
            subTitle: "Uma notica nova 2",
            content: "Nova notícia 2",
            publishedByUserId: admin.id,
            isHighlight: true,
            url: articleRepository.generateUrl("Minha notícia 2"),
            TagsOnArticles: {
                create: [
                    {
                        tag: {
                            connect: {
                                id: tag2.id,
                            },
                        },
                    },
                    {
                        tag: {
                            connect: {
                                id: tag1.id,
                            },
                        },
                    },
                    {
                        tag: {
                            connect: {
                                id: tag3.id,
                            },
                        },
                    },
                ],
            },
            CoursesOnArticles: {
                create: [
                    {
                        course: {
                            connect: {
                                id: course1.id,
                            },
                        },
                    },
                    {
                        course: {
                            connect: {
                                id: course2.id,
                            },
                        },
                    },
                ],
            },
            ClassOnArticles: {
                create: [
                    {
                        class: {
                            connect: {
                                id: class1.id,
                            },
                        },
                    },
                    {
                        class: {
                            connect: {
                                id: class2.id,
                            },
                        },
                    },
                ],
            },
            CategoryOnArticles: {
                create: [
                    {
                        category: {
                            connect: {
                                id: category1.id,
                            },
                        },
                    },
                    {
                        category: {
                            connect: {
                                id: category2.id,
                            },
                        },
                    },
                    {
                        category: {
                            connect: {
                                id: category3.id,
                            },
                        },
                    },
                ],
            },
            TextualGenreOnArticles: {
                create: [
                    {
                        textualGenre: {
                            connect: {
                                id: genre1.id,
                            },
                        },
                    },
                    {
                        textualGenre: {
                            connect: {
                                id: genre2.id,
                            },
                        },
                    },
                ],
            },
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
