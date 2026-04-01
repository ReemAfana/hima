<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'host_id',
        'title',
        'description',
        'type',
        'location',
        'price',
        'area_m2',
        'rooms',
        'damage_status',
        'has_water',
        'has_electricity',
        'is_ready',
        'status',
        'rejection_reason',
        'availability',
    ];

    protected $casts = [
        'has_water'       => 'boolean',
        'has_electricity' => 'boolean',
        'is_ready'        => 'boolean',
        'price'           => 'decimal:2',
        'area_m2'         => 'decimal:2',
    ];

    // Relationship: property belongs to a host
    public function host()
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    // Scope: only accepted + available properties (for public search)
    public function scopePublic($query)
    {
        return $query->where('status', 'accepted')
                     ->where('availability', 'available');
    }
    // Property has many bookings
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
    // Property has many images
    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    // Get main image
    public function mainImage()
    {
        return $this->hasOne(PropertyImage::class)->where('is_main', true);
    }
}