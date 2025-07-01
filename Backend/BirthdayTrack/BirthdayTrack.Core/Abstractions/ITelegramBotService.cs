using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;

public interface ITelegramBotService
{
    Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, HandleErrorSource source, CancellationToken cancellationToken);
    Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken ct);
}