<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'first_name',
        'second_name',
        'third_name',
        'last_name',
        'national_id',
        'email',
        'password',
        'phone',
        'address',
        'profile_picture',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function sendPasswordResetNotification($token): void
    {
        \Illuminate\Auth\Notifications\ResetPassword::createUrlUsing(function ($notifiable, $token) {
            return url('/api/reset-password?token=' . $token . '&email=' . urlencode($notifiable->email));
        });

        $this->notify(new \Illuminate\Auth\Notifications\ResetPassword($token));
    }
    public function favorites()
    {
        return $this->hasMany(Favorite::class, 'tenant_id');
    }
}