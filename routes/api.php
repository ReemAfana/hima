<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Email verification
Route::get('/email/verify/{id}/{hash}', function () {
    return response()->json(['message' => 'Email verified.']);
})->middleware(['auth:sanctum', 'signed'])->name('verification.verify');

Route::post('/email/resend', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification link resent.']);
})->middleware(['auth:sanctum', 'throttle:6,1']);

// Protected routes (verified users only)
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Tenant-only
    Route::middleware('role:tenant')->prefix('tenant')->group(function () {
        // Sprint 3+ routes go here
    });

    // Host-only
    Route::middleware('role:host')->prefix('host')->group(function () {
        // Sprint 2+ routes go here
    });

    // Admin-only
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Sprint 2+ routes go here
    });
});