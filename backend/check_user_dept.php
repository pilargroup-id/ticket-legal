<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('username', 'rodo.evan.bonatua')->first();
if (!$user) {
    echo "User not found\n";
    exit;
}
echo "User: " . json_encode(['id' => $user->id, 'name' => $user->name, 'username' => $user->username]) . "\n";

$depts = App\Models\UserDepartment::where('user_id', $user->id)->get();
echo "Departments in central_user_departments: " . json_encode($depts->toArray()) . "\n";
echo "Count: " . $depts->count() . "\n";
