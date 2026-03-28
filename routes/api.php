<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\Host\PropertyController as HostPropertyController;
use App\Http\Controllers\Api\Host\BookingController as HostBookingController;
use App\Http\Controllers\Api\Admin\PropertyController as AdminPropertyController;
use App\Http\Controllers\Api\Tenant\BookingController as TenantBookingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// =====================
// Public routes
// =====================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public property search
Route::get('/properties',      [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Email verification
Route::get('/email/verify/{id}/{hash}', function () {
    return response()->json(['message' => 'Email verified.']);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

Route::post('/email/resend', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link resent.']);
})->middleware(['auth:sanctum', 'throttle:6,1']);

// =====================
// Protected routes
// =====================
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Contracts (tenant, host, admin)
    Route::get('/contracts',              [ContractController::class, 'index']);
    Route::get('/contracts/{id}',         [ContractController::class, 'show']);
    Route::patch('/contracts/{id}/cancel',[ContractController::class, 'cancel']);
    Route::delete('/contracts/{id}',      [ContractController::class, 'destroy']);

    // =====================
    // Host routes
    // =====================
    Route::middleware('role:host')->prefix('host')->group(function () {
        // Property
        Route::get('/properties',                      [HostPropertyController::class, 'index']);
        Route::post('/properties',                     [HostPropertyController::class, 'store']);
        Route::get('/properties/{id}',                 [HostPropertyController::class, 'show']);
        Route::put('/properties/{id}',                 [HostPropertyController::class, 'update']);
        Route::delete('/properties/{id}',              [HostPropertyController::class, 'destroy']);
        Route::patch('/properties/{id}/availability',  [HostPropertyController::class, 'toggleAvailability']);

        // Bookings
        Route::get('/bookings',               [HostBookingController::class, 'index']);
        Route::patch('/bookings/{id}/accept', [HostBookingController::class, 'accept']);
        Route::patch('/bookings/{id}/reject', [HostBookingController::class, 'reject']);
    });

    // =====================
    // Admin routes
    // =====================
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/properties',               [AdminPropertyController::class, 'index']);
        Route::get('/properties/pending',       [AdminPropertyController::class, 'pending']);
        Route::patch('/properties/{id}/accept', [AdminPropertyController::class, 'accept']);
        Route::patch('/properties/{id}/reject', [AdminPropertyController::class, 'reject']);
        Route::delete('/properties/{id}',       [AdminPropertyController::class, 'destroy']);
    });

    // =====================
    // Tenant routes
    // =====================
    Route::middleware('role:tenant')->prefix('tenant')->group(function () {
        Route::get('/bookings',         [TenantBookingController::class, 'index']);
        Route::post('/bookings',        [TenantBookingController::class, 'store']);
        Route::get('/bookings/{id}',    [TenantBookingController::class, 'show']);
        Route::put('/bookings/{id}',    [TenantBookingController::class, 'update']);
        Route::delete('/bookings/{id}', [TenantBookingController::class, 'destroy']);
    });
});