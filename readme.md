<img src="https://github.com/user-attachments/assets/a6ae2080-e865-4fde-b41d-5a09964d7de2">

## Introduction

InvoiceShelf is an open-source web & mobile app that helps you track expenses, payments & create professional invoices & estimates.

The Web Application is made using Laravel & VueJS while the Mobile Apps are built using React Native.

To get started with InvoiceShelf using Docker Compose, check out the [Installation docs](https://docs.invoiceshelf.com/installation.html).

# Docker quick start

The repository now includes ready-to-use Docker Compose definitions so you can run InvoiceShelf with a single command.

1. Install the latest versions of [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/).
2. From the project root, build and start the containers:

   ```bash
   docker compose up --build -d
   ```

   The default stack uses SQLite for storage and exposes the app at [http://localhost:8080](http://localhost:8080).
3. Run database migrations (only needed on the first boot or after pulling new migrations):

   ```bash
   docker compose exec app php artisan migrate --force
   ```

4. Tail the application logs if you need to debug anything:

   ```bash
   docker compose logs -f app
   ```

Configuration is driven by environment variables in [`docker-compose.yml`](docker-compose.yml). You can override any value by creating a `.env` file next to the compose file (for example to change the exposed port you can add `INVOICESHELF_HTTP_PORT=9090` and update `APP_URL=http://localhost:9090`). Persisted application files live in the `invoiceshelf_storage` volume and can be inspected with `docker volume inspect invoiceshelf_storage`.

### Using MariaDB instead of SQLite

If you would prefer MariaDB, include the override file while starting the stack:

```bash
docker compose -f docker-compose.yml -f docker-compose.mysql.yml up --build -d
```

This spins up an additional `mysql` service defined in [`docker-compose.mysql.yml`](docker-compose.mysql.yml) and automatically points the Laravel container at it. Credentials can be customised through `.env` variables such as `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD`. The database files are persisted in the `invoiceshelf_mysql` volume.

# Table of Contents

1. [Docker quick start](#docker-quick-start)
2. [Documentation](#documentation)
3. [Download](#download)
4. [Mobile Apps](#mobile-apps)
5. [Discord - **NEW**](#discord) 🔥
6. [Roadmap](#roadmap)
7. [Credits](#credits)
8. [Help us translate](#translate)
9. [License](#license)

## Documentation

- [Installation Steps](https://docs.invoiceshelf.com/installation.html)
- [User Guide](https://docs.invoiceshelf.com/)
- [Developer Guide](https://docs.invoiceshelf.com/developer-guide.html)
- [API Documentation](https://api-docs.invoiceshelf.com)

## Download

- [Download Link](https://invoiceshelf.com)

## Mobile Apps

- Andorid - Coming Soon
- IOS - Coming Soon
- [Source](https://github.com/InvoiceShelf/mobile)

## Discord

Join the InvoiceShelf discord server to discuss:
[Invite Link](https://discord.gg/eHXf4zWhsR)

## Roadmap

~~Here's a rough roadmap of things to come (not in any specific order):

- [x] Automatic Update
- [x] Email Configuration
- [x] Installation Wizard
- [x] Address Customisation & Default notes
- [x] Edit Email before Sending Invoice
- [x] Available as a docker image
- [x] Performance Improvements
- [x] Customer View page
- [x] Add and Use Custom Fields on Invoices & Estimates.
- [x] Multiple Companies
- [x] Recurring Invoices
- [x] Customer Portal
- [ ] Accept Payments (Stripe Integration)
- [ ] Improved template system (invoices and estimate)
- [ ] Modules and templates marketplace

## Credits

InvoiceShelf is made possible thanks to the contributions and support from many people and projects:

- [Crater](https://github.com/crater-invoice-inc/crater) (project inspiration and code base)
- All contributors who have provided code, translations, reported issues, or supported the project in any way.

## Translate

Help us translate on https://crowdin.com/project/invoiceshelf

## License

InvoiceShelf is released under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3.
See [LICENSE](LICENSE) for details.
