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

# Copier tout le code source
COPY . .

# Créer les répertoires requis par Laravel AVANT composer install
RUN mkdir -p storage/framework/cache \
             storage/framework/sessions \
             storage/framework/views \
             storage/app/public \
             storage/logs \
             bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Installer les dépendances (avec scripts : package:discover peut maintenant écrire)
RUN composer install --no-dev --optimize-autoloader

EXPOSE 8080

CMD sh -c "php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan migrate --force && php artisan db:seed --class=ProductionSeeder --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"
