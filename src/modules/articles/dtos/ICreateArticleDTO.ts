import { Tag } from "@prisma/client";

export interface ICreateArticleDTO {
    id?: string;
    title: string;
    subTitle: string;
    content: string;
    mainImage?: string;
    publishedByUserId?: string;
    editedByUserId?: string;
    isHighlight: boolean;
    url?: string;
    tags?: string[];
    courses?: string[];
    categories?: string[];
    textualGenres?: string[];
    authors?: string[];
    classes?: string[];
}
