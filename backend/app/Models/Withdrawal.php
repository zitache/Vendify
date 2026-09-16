<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Withdrawal extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'amount', 'fee', 'net_amount',
        'method', 'phone', 'status', 'admin_note', 'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
        'amount'       => 'float',
        'fee'          => 'float',
        'net_amount'   => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
