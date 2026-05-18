<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class ProblemCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categories')->insert([
            ['name' => 'Software - Netsuite', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software - Accurate', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software - RP', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software - FRP', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software - Iseller', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Software - Lain-lain', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'HardWare - Monitor/Proyektor/TV', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'HardWare - Laptop/PC', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'HardWare - Handphone', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'HardWare - CCTV', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'HardWare - Lain-lain', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jaringan - Internet Lambat', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jaringan - Tidak Dalam Terhubung Ke Internet', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
