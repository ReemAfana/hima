<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    private function debugLog(string $runId, string $hypothesisId, string $location, string $message, array $data = []): void
    {
        try {
            $payload = [
                'sessionId' => 'be0407',
                'runId' => $runId,
                'hypothesisId' => $hypothesisId,
                'location' => $location,
                'message' => $message,
                'data' => $data,
                'timestamp' => round(microtime(true) * 1000),
            ];
            file_put_contents(base_path('debug-be0407.log'), json_encode($payload, JSON_UNESCAPED_SLASHES) . PHP_EOL, FILE_APPEND | LOCK_EX);
        } catch (\Throwable $e) {
            // Keep auth flow unaffected if debug logging fails.
        }
    }

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
        // #region agent log
        $this->debugLog('initial', 'H4', 'AuthController.php:register:post-validate', 'Register payload validated', [
            'email' => $data['email'] ?? null,
            'role' => $data['role'] ?? null,
        ]);
        // #endregion

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
        // #region agent log
        $this->debugLog('initial', 'H4', 'AuthController.php:register:post-create', 'User created and role assigned', [
            'user_id' => $user->id,
            'email_verified_at' => $user->email_verified_at,
        ]);
        // #endregion

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
    // #region agent log
    $this->debugLog('initial', 'H1', 'AuthController.php:login:post-validate', 'Login request received', [
        'email' => $credentials['email'] ?? null,
    ]);
    // #endregion

    // Use 'web' guard for attempt, then switch to sanctum for token
    if (!Auth::guard('web')->attempt($credentials)) {
        // #region agent log
        $this->debugLog('initial', 'H1', 'AuthController.php:login:attempt-failed', 'Web guard attempt failed', [
            'email' => $credentials['email'] ?? null,
        ]);
        // #endregion
        return response()->json(['message' => 'Invalid credentials.'], 401);
    }

    $user = Auth::guard('web')->user();
    // #region agent log
    $this->debugLog('initial', 'H2', 'AuthController.php:login:post-attempt', 'Web guard authenticated user', [
        'user_id' => $user?->id,
        'email_verified' => (bool) $user?->hasVerifiedEmail(),
    ]);
    // #endregion

    if (!$user->hasVerifiedEmail()) {
        // #region agent log
        $this->debugLog('initial', 'H2', 'AuthController.php:login:email-unverified', 'Blocked by unverified email gate', [
            'user_id' => $user->id,
        ]);
        // #endregion
        return response()->json(['message' => 'Please verify your email first.'], 403);
    }

    $token = $user->createToken('auth_token')->plainTextToken;
    $role  = $user->getRoleNames()->first();
    // #region agent log
    $this->debugLog('initial', 'H3', 'AuthController.php:login:token-created', 'Sanctum token created', [
        'user_id' => $user->id,
        'has_role' => (bool) $role,
    ]);
    // #endregion

    return response()->json([
        'token' => $token,
        'role'  => $role,
        'user'  => $user,
    ]);
}

    public function logout(Request $request)
    {
        // #region agent log
        $this->debugLog('initial', 'H5', 'AuthController.php:logout:entry', 'Logout called', [
            'user_id' => $request->user()?->id,
            'has_current_token' => (bool) $request->user()?->currentAccessToken(),
        ]);
        // #endregion
        $request->user()->currentAccessToken()->delete();
        // #region agent log
        $this->debugLog('initial', 'H5', 'AuthController.php:logout:post-delete', 'Current access token deleted', [
            'user_id' => $request->user()?->id,
        ]);
        // #endregion

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $role = $user->getRoleNames()->first();
        // #region agent log
        $this->debugLog('initial', 'H3', 'AuthController.php:me:resolved-user', 'Resolved user from sanctum token', [
            'user_id' => $user?->id,
            'has_role' => (bool) $role,
        ]);
        // #endregion

        return response()->json([
            'user' => $user,
            'role' => $role,
        ]);
    }
}