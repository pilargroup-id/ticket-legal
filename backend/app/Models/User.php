<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens;

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        // Ambil departemen utama dari central_user_departments
        $primaryDept = $this->userDepartments()
            ->where('is_primary', 1)
            ->first();

        $deptId = $primaryDept ? $primaryDept->department_id : null;

        // Mapping department_id → nama departemen (sesuai pilargroup)
        $deptNameMap = [
            1  => 'HUMAN CAPITAL',
            2  => 'LEGAL',
            3  => 'MARKETING',
            4  => 'RETAIL ECOMMERCE',
            5  => 'SUPPLY CHAIN',
            6  => 'PRODUCT',
            7  => 'FINANCE',
            8  => 'IT',
            9  => 'STORE',
            10 => 'SALES B2B',
            11 => 'SALES GT',
            12 => 'BOARD OF DIRECTOR',
        ];
        $deptName = $deptId ? ($deptNameMap[$deptId] ?? null) : null;

        // central_users tidak punya kolom role — hanya divisi LEGAL yang jadi admin
        $adminDepts = ['LEGAL'];
        $role = in_array($deptName, $adminDepts) ? 'admin' : 'user';

        return [
            'sub'           => $this->id,
            'username'      => $this->username,
            'name'          => $this->name,
            'role'          => $role,
            'department_id' => $deptId,
            'department'    => $deptName,
            'company_id'    => 1,
            'company'       => 'PilarGroup',
            'job_position'  => $this->job_position,
            'apps'          => [],
        ];
    }

    // Tabel central_users ada di database pilargroup
    protected $connection = 'pilargroup';
    protected $table = 'central_users';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'username',
        'email',
        'phone',
        'job_position',
        'password',
        'is_active',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'password'  => 'hashed',
    ];

    // Accessor: supaya kode yang masih pakai ->status tetap jalan
    public function getStatusAttribute(): string
    {
        return $this->is_active ? 'active' : 'inactive';
    }

    public function userDepartments()
    {
        // FK di central_user_departments adalah user_id
        return $this->hasMany(UserDepartment::class, 'user_id', 'id');
    }
}
