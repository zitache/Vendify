<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id', 'name', 'description', 'price', 'quantity', 'category_id', 'locality', 'image_url'
    ];

    public function getImageUrlAttribute($value)
    {
        if ($value && !str_starts_with($value, 'http')) {
            return env('APP_URL', 'http://localhost:8000') . $value;
        }
        return $value;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
