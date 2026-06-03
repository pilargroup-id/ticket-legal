<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UsersResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
 public function toArray(Request $request): array
{
    // department info comes from userDepartments (department_id), not a direct column
    $primaryDept = $this->userDepartments?->where('is_primary', 1)->first();
    $deptId      = $primaryDept?->department_id;

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
        'id'              => $this->id,
        'name'            => $this->name,
        'username'        => $this->username,
        'email'           => $this->email,
        'role'            => $role,
        'department_id'   => $deptId,
        'department_name' => $deptName,
        'location_id'     => null,
        'location_name'   => null,
        'phone'           => $this->phone,
        'status'          => $this->status,
        'job_position'    => $this->job_position,
        'is_approved'     => (bool) ($this->is_approved ?? false),
        'created_at'      => $this->created_at,
        'updated_at'      => $this->updated_at,
    ];
}

}
