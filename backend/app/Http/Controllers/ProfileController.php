<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string',
            'locality' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($user->photo) {
                $oldPath = str_replace('/storage/', '', $user->photo);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('photo')->store('profiles', 'public');
            $validated['photo'] = Storage::url($path);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    public function updatePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = $request->user();

        if ($user->photo) {
            $oldPath = str_replace('/storage/', '', parse_url($user->photo, PHP_URL_PATH));
            Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('photo')->store('profiles', 'public');
        $user->update(['photo' => Storage::url($path)]);

        return response()->json([
            'message' => 'Photo mise à jour avec succès',
            'user' => $user,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }
}
