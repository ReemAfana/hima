<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\Host\PropertyImageController;
use App\Http\Controllers\Api\Tenant\FavoriteController;
use App\Http\Controllers\Api\Admin\BookingController as AdminBookingController;
use App\Http\Controllers\Api\Host\PropertyController as HostPropertyController;
use App\Http\Controllers\Api\Host\BookingController as HostBookingController;
use App\Http\Controllers\Api\Admin\PropertyController as AdminPropertyController;
use App\Http\Controllers\Api\Tenant\BookingController as TenantBookingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// =====================
// Public routes
// =====================
Route::post('/register',        [AuthController::class, 'register']);
Route::post('/login',           [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendLink']);
Route::post('/reset-password',  [PasswordResetController::class, 'reset']);
Route::get('/properties/{id}/whatsapp', [PropertyController::class, 'whatsappLink']);
// Public property search
Route::get('/properties',              [PropertyController::class, 'index']);
Route::get('/properties/{id}',         [PropertyController::class, 'show']);
Route::get('/properties/{id}/reviews', [ReviewController::class, 'propertyReviews']);
Route::get('/users/{id}/reviews',      [ReviewController::class, 'userReviews']);
// Locations
Route::get('/governorates',                    [LocationController::class, 'governorates']);
Route::get('/governorates/{id}/cities',        [LocationController::class, 'cities']);
Route::get('/cities/{id}/neighborhoods', [LocationController::class, 'neighborhoods']);
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

    // Profile management
    Route::put('/profile',                 [ProfileController::class, 'update']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);
    Route::put('/profile/change-email',    [ProfileController::class, 'changeEmail']);

    // Contracts
    Route::get('/contracts',               [ContractController::class, 'index']);
    Route::get('/contracts/{id}',          [ContractController::class, 'show']);
    Route::patch('/contracts/{id}/cancel', [ContractController::class, 'cancel']);
    Route::delete('/contracts/{id}',       [ContractController::class, 'destroy']);
    Route::get('/contracts/{id}/pdf',          [ContractController::class, 'getPdfUrl']);
    Route::get('/contracts/{id}/download',     [ContractController::class, 'downloadPdf']);

    // Reviews
    Route::post('/reviews', [ReviewController::class, 'store']);

    // Notifications
    Route::get('/notifications',                 [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count',    [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/{id}/read',     [NotificationController::class, 'markAsRead']);
    Route::patch('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    // =====================
    // Host routes
    // =====================
    Route::middleware('role:host')->prefix('host')->group(function () {
        Route::get('/properties',                      [HostPropertyController::class, 'index']);
        Route::post('/properties',                     [HostPropertyController::class, 'store']);
        Route::get('/properties/{id}',                 [HostPropertyController::class, 'show']);
        Route::put('/properties/{id}',                 [HostPropertyController::class, 'update']);
        Route::delete('/properties/{id}',              [HostPropertyController::class, 'destroy']);
        Route::patch('/properties/{id}/availability',  [HostPropertyController::class, 'toggleAvailability']);
        // Property Images
        Route::get('/properties/{propertyId}/images',           [PropertyImageController::class, 'index']);
        Route::post('/properties/{propertyId}/images',          [PropertyImageController::class, 'store']);
        Route::patch('/properties/{propertyId}/images/{imageId}/main', [PropertyImageController::class, 'setMain']);
        Route::delete('/properties/{propertyId}/images/{imageId}',     [PropertyImageController::class, 'destroy']);
        Route::get('/bookings',               [HostBookingController::class, 'index']);
        Route::patch('/bookings/{id}/accept', [HostBookingController::class, 'accept']);
        Route::patch('/bookings/{id}/reject', [HostBookingController::class, 'reject']);
    });

    // =====================
    // Admin routes
    // =====================
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Properties
        Route::get('/properties',               [AdminPropertyController::class, 'index']);
        Route::get('/properties/pending',       [AdminPropertyController::class, 'pending']);
        Route::patch('/properties/{id}/accept', [AdminPropertyController::class, 'accept']);
        Route::patch('/properties/{id}/reject', [AdminPropertyController::class, 'reject']);
        Route::delete('/properties/{id}',       [AdminPropertyController::class, 'destroy']);

        // Bookings
        Route::get('/bookings',          [AdminBookingController::class, 'index']);
        Route::get('/bookings/{id}',     [AdminBookingController::class, 'show']);
        Route::delete('/bookings/stale', [AdminBookingController::class, 'archiveStale']);
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
        // Favorites
        Route::get('/favorites',              [FavoriteController::class, 'index']);
        Route::post('/favorites',             [FavoriteController::class, 'store']);
        Route::delete('/favorites/{propertyId}', [FavoriteController::class, 'destroy']);
    });
});