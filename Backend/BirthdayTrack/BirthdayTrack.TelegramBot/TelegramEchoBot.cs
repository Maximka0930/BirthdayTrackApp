using System;
using System.Threading;
using System.Threading.Tasks;
using BirthdayTrack.Core.Abstractions;
using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

public class TelegramEchoBot : IUpdateHandler
{
    private readonly ITelegramBotClient _botClient;
    private readonly CancellationTokenSource _cts;
    private readonly IUsersAllInfoService _userAllInfoService;

    public TelegramEchoBot(string token)
    {
        _botClient = new TelegramBotClient(token);
        _cts = new CancellationTokenSource();
    }

    public async Task StartReceivingAsync()
    {
        Console.WriteLine("Запуск бота...");

        var receiverOptions = new ReceiverOptions
        {
            AllowedUpdates = Array.Empty<UpdateType>(),
        };

        // Используем this, так как класс реализует IUpdateHandler
        _botClient.StartReceiving(
            updateHandler: this,
            receiverOptions: receiverOptions,
            cancellationToken: _cts.Token
        );

        var me = await _botClient.GetMe(_cts.Token);
        Console.WriteLine($"Бот @{me.Username} готов к работе!");
    }

    public void StopReceiving()
    {
        _cts.Cancel();
        Console.WriteLine("Бот остановлен");
    }

    // Реализация IUpdateHandler
    public async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
    {
        if (update.Message is not { Text: { } messageText })
            return;

        var chatId = update.Message.Chat.Id;
        var username = update.Message.From?.Username ?? update.Message.From?.FirstName;

        Console.WriteLine($"Получено сообщение от {username}: {messageText}");

        await botClient.SendMessage(
            chatId: chatId,
            text: messageText,
            cancellationToken: cancellationToken);
    }

    // Реализация IUpdateHandler
    public Task HandlePollingErrorAsync(ITelegramBotClient botClient, Exception exception, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Ошибка: {exception.Message}");
        return Task.CompletedTask;
    }

    public Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, HandleErrorSource source, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}