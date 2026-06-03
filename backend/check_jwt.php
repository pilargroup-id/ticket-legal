<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('username', 'rodo.evan.bonatua')->first();
$token = Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);
$payload = Tymon\JWTAuth\Facades\JWTAuth::setToken($token)->getPayload()->toArray();
echo "JWT Payload:\n";
print_r($payload);

