<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'first_name'            => 'required|string|max:50',
            'second_name'           => 'required|string|max:50',
            'third_name'            => 'required|string|max:50',
            'last_name'             => 'required|string|max:50',
            'national_id'           => 'required|string|unique:users,national_id',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'role'                  => 'required|in:tenant,host',
            'phone'                 => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'first_name'  => $data['first_name'],
            'second_name' => $data['second_name'],
            'third_name'  => $data['third_name'],
            'last_name'   => $data['last_name'],
            'national_id' => $data['national_id'],
            'email'       => $data['email'],
            'password'    => $data['password'], // auto-hashed by cast
            'phone'       => $data['phone'] ?? null,
        ]);

        $user->assignRole($data['role']);

        event(new Registered($user)); // triggers email verification

        return response()->json([
            'message' => 'Account created. Please verify your email.',
        ], 201);
    }

   public function login(Request $request)
{
    $credentials = $request->validate([
        'email'    => 'required|email',
        'password' => 'required|string',
    ]);

    // Use 'web' guard for attempt, then switch to sanctum for token
    if (!Auth::guard('web')->attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials.'], 401);
    }

    $user = Auth::guard('web')->user();

    if (!$user->hasVerifiedEmail()) {
        return response()->json(['message' => 'Please verify your email first.'], 403);
    }

    $token = $user->createToken('auth_token')->plainTextToken;
    $role  = $user->getRoleNames()->first();

    return response()->json([
        'token' => $token,
        'role'  => $role,
        'user'  => $user,
    ]);
}

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $role = $user->getRoleNames()->first();

        return response()->json([
            'user' => $user,
            'role' => $role,
        ]);
    }
}