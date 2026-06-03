<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('username', 'rodo.evan.bonatua')->first();
$user->load('userDepartments');
$resource = new App\Http\Resources\UsersResource($user);
$request = request();
$data = $resource->toArray($request);

echo "UsersResource Data:\n";
print_r($data);
