<?php

return [

    /*
    | Chemins qui acceptent les requêtes cross-origin (preflight + réelles)
    */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    | Origins autorisées :
    |  - la variable FRONTEND_URL (URL Vercel / locale)
    |  - tout sous-domaine *.vercel.app (previews Vercel)
    |  - localhost pour le dev
    */
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        'http://localhost:5173',
        'http://localhost:3000',
    ],

    'allowed_origins_patterns' => [
        '#^https://.*\.vercel\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    /*
    | false car on utilise Bearer token (pas de cookies de session)
    */
    'supports_credentials' => false,

];
