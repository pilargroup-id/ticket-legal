<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            LocationSeeder::class,
            DepartmentSeeder::class,
            // RoleSeeder::class, // Table does not exist in migration schema
            UserSeeder::class,
            ProblemCategorySeeder::class,
            // StatusSeeder::class, // Field is enum in tickets table
            // PrioritySeeder::class, // Field is enum in tickets table
            AssetsSeeder::class,
        ]);
    }
}
