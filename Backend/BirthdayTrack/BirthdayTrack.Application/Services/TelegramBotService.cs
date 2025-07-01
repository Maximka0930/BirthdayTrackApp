using BirthdayTrack.Core.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Telegram.Bot.Polling;
using Telegram.Bot;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;

public class TelegramBotService : BackgroundService, IUpdateHandler
{
    private readonly ITelegramBotClient _botClient;
    private readonly IServiceScopeFactory _scopeFactory;

    public TelegramBotService(
        ITelegramBotClient botClient,
        IServiceScopeFactory scopeFactory)
    {
        _botClient = botClient;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken ct)
    {
        var me = await _botClient.GetMe(ct);
        Console.WriteLine($"Бот @{me.Username} запущен");

        _botClient.StartReceiving(
            updateHandler: this,
            receiverOptions: null,
            cancellationToken: ct
        );

        while (!ct.IsCancellationRequested)
        {
            var now = DateTime.Now;
            var targetTime = new DateTime(now.Year, now.Month, now.Day, 10, 0, 0); // 12:00

            if (now > targetTime)
            {
                targetTime = targetTime.AddDays(1);
            }

            var delay = targetTime - now;
            Console.WriteLine($"Следующая проверка в {targetTime} (через {delay.TotalHours:0.00} часов)");

            await Task.Delay(delay, ct);

            using (var scope = _scopeFactory.CreateScope())
            {
                var service = scope.ServiceProvider.GetRequiredService<IUsersAllInfoService>();
                Console.WriteLine($"[{DateTime.Now}] Запуск проверки дней рождений");
                await CheckBirthdays(service, ct);
            }
        }
    }

    private async Task CheckBirthdays(IUsersAllInfoService service, CancellationToken ct)
    {
        var today = DateTime.Today;
        var users = await service.GetAllUsers();
        Console.WriteLine($"Найдено пользователей: {users.Count}");

        foreach (var user in users)
        {
            try
            {
                // 3. Проверяем, что дата рождения совпадает с сегодняшней
                if (user.DateOfBirth.Day == today.Day &&
                    user.DateOfBirth.Month == today.Month)
                {
                    Console.WriteLine($"Найден ДР: {user.Name} {user.SurName} ({user.DateOfBirth:dd.MM})");

                    // 4. Отправляем сообщение (ВАЖНЫЕ ИСПРАВЛЕНИЯ)
                    await _botClient.SendMessage(
                        chatId: 1169214242, 
                        text: $"🎉 Сегодня {user.SurName} {user.Name} празднует день рождения!\n" +
                        $"Не забудьте поздравить!😊",
                        cancellationToken: ct);

                    Console.WriteLine($"Уведомление отправлено для {user.Name}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка для {user.Name}: {ex.Message}");
            }
        }
    }


    public async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken ct)
    {
        if (update.Message is { Chat.Id: long chatId })
        {
            await botClient.SendMessage(
                chatId: chatId,
                text: $"Ваш chatId: `{chatId}`",
                parseMode: ParseMode.Markdown,
                cancellationToken: ct);
        }
    }

    public Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, HandleErrorSource source, CancellationToken cancellationToken)
    {
        Console.WriteLine($"Ошибка: {exception.Message}");
        return Task.CompletedTask;
    }
}