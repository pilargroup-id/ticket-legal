<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserDepartment extends Model
{
    // Tabel ini ada di database pilargroup
    protected $connection = 'pilargroup';
    protected $table = 'central_user_departments';

    protected $fillable = [
        'user_id',
        'department_id',
        'is_primary',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
