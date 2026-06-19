<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use App\Models\Message;

class MessageReceived extends Notification
{
    use Queueable;

    protected $messageData;

    /**
     * Create a new notification instance.
     */
    public function __construct(Message $message)
    {
        $this->messageData = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $senderName = $this->messageData->sender->name;
        
        return (new MailMessage)
            ->subject("Nouveau message de {$senderName} sur Vendify")
            ->greeting("Bonjour {$notifiable->name},")
            ->line("Vous avez reçu un nouveau message de **{$senderName}** sur la plateforme Vendify.")
            ->line("Message :")
            ->line("« {$this->messageData->content} »")
            ->action('Voir le message', url('http://localhost:5173/messages'))
            ->line('Merci d\'utiliser notre plateforme !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
