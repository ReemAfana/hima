<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    // إكمال البيانات لأول مرة
    public function complete(Request $request)
    {
        $user = $request->user();

        // إذا البيانات كاملة أصلاً
        if ($user->isProfileComplete()) {
            return response()->json([
                'message' => 'Profile is already complete.',
            ], 200);
        }

        $data = $request->validate([
            'second_name' => 'required|string|max:50',
            'third_name'  => 'required|string|max:50',
            'last_name'   => 'required|string|max:50',
            'national_id' => 'required|string|unique:users,national_id,' . $user->id,
            'phone'       => 'required|string|max:20',
        ]);

        $user->update($data);

        return response()->json([
            'message'             => 'Profile completed successfully.',
            'user'                => $user,
            'is_profile_complete' => $user->isProfileComplete(),
        ]);
    }

    // تحديث البيانات
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'first_name'  => 'sometimes|string|max:50',
            'second_name' => 'sometimes|string|max:50',
            'third_name'  => 'sometimes|string|max:50',
            'last_name'   => 'sometimes|string|max:50',
            'national_id' => 'sometimes|string|unique:users,national_id,' . $user->id,
            'phone'       => 'sometimes|string|max:20',
        ]);

        $user->update($data);

        return response()->json([
            'message'             => 'Profile updated successfully.',
            'user'                => $user,
            'is_profile_complete' => $user->isProfileComplete(),
        ]);
    }

    // تغيير كلمة المرور
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 403);
        }

        $user->update(['password' => Hash::make($request->password)]);

        $user->tokens()->delete();

        return response()->json(['message' => 'Password changed successfully.']);
    }

    // تغيير الإيميل
    public function changeEmail(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'email'            => 'required|email|unique:users,email',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 403);
        }

        $user->update([
            'email'             => $request->email,
            'email_verified_at' => null,
        ]);

        $user->sendEmailVerificationNotification();

        $user->tokens()->delete();

        return response()->json([
            'message' => 'Email updated. Please verify your new email.',
        ]);
    }
}