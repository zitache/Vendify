<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Notifications\MessageReceived;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user_id = $request->user()->id;
        
        // Liste des contacts (utilisateurs avec qui on a des messages)
        $messages = Message::where('sender_id', $user_id)
            ->orWhere('receiver_id', $user_id)
            ->with(['sender', 'receiver', 'product'])
            ->latest()
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'product_id' => 'nullable|exists:products,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'product_id' => $request->product_id,
            'content' => $request->content,
            'is_read' => false,
        ]);

        $receiver = User::find($request->receiver_id);
        if ($receiver) {
            try {
                $receiver->notify(new MessageReceived($message));
            } catch (\Exception $e) {
                // Email failed to send, but we still want to return the message.
                \Illuminate\Support\Facades\Log::error('Failed to send message notification: ' . $e->getMessage());
            }
        }

        return response()->json($message->load(['sender', 'receiver', 'product']), 201);
    }

    public function markAsRead(Request $request, Message $message)
    {
        if ($message->receiver_id === $request->user()->id) {
            $message->update(['is_read' => true]);
        }
        return response()->json($message);
    }
}
