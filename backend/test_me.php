<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('username', 'rodo.evan.bonatua')->first();
$token = Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);

// Simulate request to /api/profile
$request = Illuminate\Http\Request::create('/api/profile', 'GET');
$request->headers->set('Authorization', 'Bearer ' . $token);
$response = app()->handle($request);
echo "Response status: " . $response->getStatusCode() . "\n";
echo "Response content:\n";
echo $response->getContent();
