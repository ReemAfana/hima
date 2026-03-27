<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\Host\PropertyController as HostPropertyController;
use App\Http\Controllers\Api\Admin\PropertyController as AdminPropertyController;
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

    // =====================
    // Host routes
    // =====================
    Route::middleware('role:host')->prefix('host')->group(function () {
        Route::get('/properties',                        [HostPropertyController::class, 'index']);
        Route::post('/properties',                       [HostPropertyController::class, 'store']);
        Route::get('/properties/{id}',                   [HostPropertyController::class, 'show']);
        Route::put('/properties/{id}',                   [HostPropertyController::class, 'update']);
        Route::delete('/properties/{id}',                [HostPropertyController::class, 'destroy']);
        Route::patch('/properties/{id}/availability',    [HostPropertyController::class, 'toggleAvailability']);
    });

    // =====================
    // Admin routes
    // =====================
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/properties',                [AdminPropertyController::class, 'index']);
        Route::get('/properties/pending',        [AdminPropertyController::class, 'pending']);
        Route::patch('/properties/{id}/accept',  [AdminPropertyController::class, 'accept']);
        Route::patch('/properties/{id}/reject',  [AdminPropertyController::class, 'reject']);
        Route::delete('/properties/{id}',        [AdminPropertyController::class, 'destroy']);
    });

    // =====================
    // Tenant routes
    // =====================
    Route::middleware('role:tenant')->prefix('tenant')->group(function () {
        // Sprint 3+ routes go here
    });
});