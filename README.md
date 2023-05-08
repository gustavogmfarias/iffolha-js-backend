# iffolha-js-backend

# Portal do jornal Universitário IFFolha - Instituto Federal Fluminense - Itaperuna\RJ

Olá a todos. Esse projeto será meu trabalho de graduação (TCC) na instituição em que faço Sistemas de Informação, o glorioso Instituto Federal Fluminense, localizado na cidade de itaperuna rio de janeiro.

### Tecnologias

-   Typescript (linguagem de programação)
-   NodeJS (back-end)
-   ReactJS (Front-end, estará em outro repositório)
-   Swagger (documentação)
-   Jest\SuperTest (testes automatizados integrados e unitários)
-   Prisma (orm)
-   Postgres (banco de dados)
-   Docker (orquestração dos containers)
-   Insomnia (testes de requests)

### Features já desenvolvidas

# Logs

-   Should be able to include a log after every call to the database

# Persistir Usuários

-   Should be able to create a new user
-   Should not be able to create a new user with the same email;
-   Only admins should be able to include a new user;
-   Only admins should be able to delete a user;
-   Only admins should be able to edit a user;
-   Should be able to list users;
-   Should be able to search an user by title;
-   Should be able to search an user by email;
-   Should be able to search an user by id;

# Login

=> Regras de Negócio

-   User should be able to login
-   User should be able to change his password
-   User shouldn't be able to login if the password is incorrect
-   User shoudln't be able to change his password if he doesn't know his before password

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

# Logs

-   Should be able to list the logs
-   Should be able to filter by period

# Login

=> Regras de Negócio

-   If user doesn't know his before password, he should to recovery by email
-   User should be able to recovery his password

# Persistir Notícias

=> Regras de Negócios

-   Should be able to include a new Article;
-   Only Admin users, authors or editor users should be able to include a new Article;
-   Only admin users or editor users should be able to delete a Article;
-   Only admin users or editor users should be able to edit a Article;
-   Should be able to include a main image;
-   Should not be able to include main images with different size than default;
-   Should be able to include Tags;
-   Should be able to add a new tag if it doesn't exist;
-   Should be able to Delete tags;
-   Should be able to list all the Articles;
-   Should be able to order the Articles by date of inclusion;
-   Should be able to search the Articles by title;
-   Should be able to search the Articles by author;
-   Should be able to search the Articles by the user who posted the Article;
-   Should be able to search the Article for period of dates;
-   Should be able to order the list clicking in the head of the table;
-   should be able to set highlight news;
-   The highlight news should to be show in order was posted;
-   Should be able to include a Category in the Article;
-   Should be able to add a new category in the moment of the inclusion if it doesn't exist;
-   Should be able to include the author in the Article;
-   Should no be able to include the author doesn't exist;
-   If the author doesn't exist, should be able to include in the moment that was called;
-   Should be able to generate a slug after the include of the news;
-   Should be able to generate a review in the moment of including;
-   Should be able to mark to the news appreas in the repository session
-   Should be Able to include Courses
-   Should be able to remove Courses
-   Should be able to include classes
-   Should be able to remove classes

# Persistir Textos no Repositórios

-   Should be able to include a new Article;
-   Only Admin users, authors or editor users should be able to include a new Article;
-   Only admin users or editor users should be able to delete a Article;
-   Only admin users or editor users should be able to edit a Article;
-   Should be able to include a main image;
-   Should not be able to include main images with different size than default;
-   Should be able to include Tags;
-   Should be able to add a new tag if it doesn't exist;
-   Should be able to Delete tags;
-   Should be able to list all the Articles;
-   Should be able to order the Articles by date of inclusion;
-   Should be able to search the Articles by title;
-   Should be able to search the Articles by author;
-   Should be able to search the Articles by the user who posted the Article;
-   Should be able to search the Article for period of dates;
-   Should be able to order the list clicking in the head of the table;
-   Should be able to include a Category in the Article;
-   Should be able to add a new category in the moment of the inclusion if it doesn't exist;
-   Should be able to include the author in the Article;
-   Should no be able to include the author doesn't exist;
-   If the author doesn't exist, should be able to include in the moment that was called;
-   Should be able to generate a slug after the include of the news;
-   Should be able to generate a review in the moment of including;
-   Should be able to download Articles of the news
-   Should be Able to include Courses
-   Should be able to remove Courses
-   Should be able to include classes
-   Should be able to remove classes

# Persistir Tags

-   Should be able to create a tag;
-   Should be able to list tags;
-   Only Admin users, authors or editor users should be able to include a new tag;
-   Only admin users or editor users should be able to delete a tag;
-   Only admin users or editor users should be able to edit a tag;
-   Should be able to list all the Articles by tags;
-   Should be abble to list all the Articles by tag;

# Persistir Categorias de Texto

-   Should be able to create a category;
-   Should be able to list categorys;
-   Only Admin users, authors or editor users should be able to include a new category;
-   Only admin users or editor users should be able to delete a category;
-   Only admin users or editor users should be able to edit a category;
-   Should be able to list all the Articles by categorys;
-   Should be abble to list all the Articles by category;

# Persistir Courses

-   Should be able to create a course;
-   Should be able to list courses;
-   Only Admin users, authors or editor users should be able to include a new course;
-   Only admin users or editor users should be able to delete a course;
-   Only admin users or editor users should be able to edit a course;
-   Should be able to list all the Articles by courses;
-   Should be abble to list all the Articles by course;

# Persistir Classes

-   Should be able to create a classe;
-   Should be able to list classes;
-   Only Admin users, authors or editor users should be able to include a new classe;
-   Only admin users or editor users should be able to delete a classe;
-   Only admin users or editor users should be able to edit a classe;
-   Should be able to list all the Articles by classes;
-   Should be abble to list all the Articles by classe;

# Configurations

-   Only admins should be able to change the Configurations
-   Should be able to change the title;
-   Should be able to change the logo;
-   Should be able to change the favicon;
-   Should be able to change the main bar color;
-   Should be able to change the social media
-   Should be able to include new social medias
-   Should be able to change to set the menu alert;

# Contact

-   Guests should be able to send a contact message on the portal
-   Should be able to list the contacts calls

# Newsletter

-   Should be able to register a newsletter on the webpage
-   Should be able to list the registeres

# Video

-   Should be able to register a video on the webpage
-   Should be able to list the videos

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

-   git clone https://github.com/gustavogmfarias/iffolha-js-backend
-   yarn
-   docker-compose up
-   yarn seed (para alimentar o bd de usuário)
-   yarn dev

[⬆ Voltar ao topo](#iffolha-js-backend)
