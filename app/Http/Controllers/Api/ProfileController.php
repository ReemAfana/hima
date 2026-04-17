<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    // Update profile info
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'phone'   => 'nullable|string|max:20',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user'    => $user,
        ]);
    }

    // Change password
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 403);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }

    // Change email
    public function changeEmail(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'email'            => 'required|email|unique:users,email',
        ]);

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 403);
        }

        $user->update([
            'email'             => $request->email,
            'email_verified_at' => null, // require re-verification
        ]);

        // Send verification email to new address
        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Email updated. Please verify your new email address.',
        ]);
    }
}