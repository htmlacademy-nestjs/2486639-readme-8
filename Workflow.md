# Как работать над проектом
```bash
# перейти в папку с проектом
cd ~/readme/project

# установить зависимости
npm install

# Скопировать .env-example -> .env:
cp apps/account/.env-example apps/account/.env
cp apps/api/.env-example apps/api/.env
cp apps/blog/.env-example apps/blog/.env
cp apps/file-storage/.env-example apps/file-storage/.env
cp apps/notify/.env-example apps/notify/.env

# добавить docker-compose
docker compose --file ./apps/account/docker-compose.dev.yml --project-name "readme-account" --env-file ./apps/account/.env up -d
docker compose --file ./apps/blog/docker-compose.dev.yml --project-name "readme-blog" --env-file ./apps/blog/.env up -d
docker compose --file ./apps/file-storage/docker-compose.dev.yml --project-name "file-storage" --env-file ./apps/file-storage/.env up -d
docker compose --file ./apps/notify/docker-compose.dev.yml --project-name "notify" --env-file ./apps/notify/.env up -d

# сформировать PrismaClient
npx nx run blog:db:generate

# инициализировать БД postgres - blog
npx nx run blog:db:migrate

# наполнение тестовыми данными
npx nx run account:db:seed
npx nx run blog:db:seed

# запуск сервисов
npx nx run account:serve
npx nx run blog:serve
npx nx run file-storage:serve
npx nx run notify:serve
npx nx run api:serve

#запуск рассылки - уведомление о новых публикациях
curl http://localhost:4100/api/run-news-letter
```

## Окружение

Для удобства работы над проектом используются инструменты из **Node.js** и **npm**. Все необходимые настройки произведены. Убедитесь, что на рабочем компьютере установлена **Node.js**, соответсвтующая актуальной версии. Актуальная версия **Node.js** указана в файле `package.json` в поле `node`. После, в терминале, перейти в директорию с проектом и _единожды_ запустите команду:

```bash
npm install
```

Данная команда запустит процесс установки зависимостей проекта из **npm**.

### Сценарии

После создания проекта вам доступны следующие сценарии.

#### Компиляция проекта

```bash
npm run compile
```

Во время выполнения инструкций по компиляции проекта, в корне проекта создается директория `dist`, в которую будут помещены результирующие файлы.

#### Очистка проекта

```bash
npm run clean
```

Во время выполения инструкции по очистке проекта, директория `dist`, которая предназначена для хранения результирующих файлов, будет удалена.

#### Сборка проекта

```bash
npm run build
```

В процессе сборки приложения, будут выполнены инструкции «Очистка проекта» и «Компиляция проекта». 

#### Проверка линтером

```bash
npm run lint
```

Запуск проверки проекта статическим анализатором кода **ESLint**.

Анализ кода производится только в файлах, которые находятся в директории `src`.

**Обратите внимание**, при запуске данной команды, ошибки выводятся в терминал.

#### Запуск REPL

```bash
npm run ts
```

Запуск `ts-node` позволяет вам напрямую выполнять код TypeScript на NodeJS без предварительной компиляции. 

#### Запуск проекта

```bash
npm start
```

В процессе запуска проекта будет выполнен процесс «Сборки проекта» и запуска результирующего кода.

## Структура проекта

### Директория `src`

В директории размещаются исходный код проекта: компоненты, модули и так далее. Структура директории `src` может быть произвольной.

### Файл `Readme.md`

Файл, содержащий инструкции по работе с учебным репозиторием.

### Файл `Contributing.md`

Файл, содержащий советы и инструкции по внесению изменений в учебный репозиторий.

### Остальное

Все остальные файлы в проекте являются служебными. Пожалуйста, не удаляйте и не изменяйте их самовольно. Только если того требует задание или наставник.
