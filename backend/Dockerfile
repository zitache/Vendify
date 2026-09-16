FROM php:8.3-cli

# Extensions requises par Laravel + DomPDF
RUN apt-get update && apt-get install -y \
        libpq-dev libzip-dev libpng-dev libonig-dev libxml2-dev unzip \
    && docker-php-ext-install \
        pdo pdo_pgsql pdo_mysql zip mbstring gd dom xml \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Dépendances PHP en premier (layer cache)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Code source
COPY . .

# Re-run scripts après la copie du code
RUN composer dump-autoload --optimize

# Permissions storage / cache
RUN mkdir -p storage/framework/{cache,sessions,views} bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8080

# migrate + serve au démarrage
CMD sh -c "php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"
