<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *    title="AgriKara API",
 *    version="1.0.0",
 *    description="API pour la plateforme de commerce agricole AgriKara",
 * )
 * @OA\Server(
 *    url="http://localhost:8000/api",
 *    description="Serveur de développement"
 * )
 */

/**
 * @OA\SecurityScheme(
 *    type="http",
 *    description="Login with email and password to get the authentication token",
 *    name="Token based based auth",
 *    in="header",
 *    scheme="bearer",
 *    bearerFormat="JWT",
 *    securityScheme="api_key",
 * )
 */

/**
 * @OA\Tag(
 *     name="Authentication",
 *     description="Endpoints d'authentification"
 * )
 * @OA\Tag(
 *     name="Products",
 *     description="Gestion des produits"
 * )
 * @OA\Tag(
 *     name="Categories",
 *     description="Gestion des catégories"
 * )
 * @OA\Tag(
 *     name="Orders",
 *     description="Gestion des commandes"
 * )
 * @OA\Tag(
 *     name="Messages",
 *     description="Systeme de messagerie"
 * )
 * @OA\Tag(
 *     name="Profile",
 *     description="Gestion du profil utilisateur"
 * )
 * @OA\Tag(
 *     name="Dashboard",
 *     description="Tableaux de bord"
 * )
 */

class SwaggerController
{
    // Ce contrôleur est utilisé uniquement pour documenter les endpoints Swagger
}
