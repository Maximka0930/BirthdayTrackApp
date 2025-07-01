using BirthdayTrack.Application.Services;
using BirthdayTrack.Core.Abstractions;
using BirthdayTrack.Data;
using BirthdayTrack.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Telegram.Bot;

var builder = WebApplication.CreateBuilder(args);

// 1. Регистрируем сервис бота
builder.Services.AddSingleton<ITelegramBotClient>(new TelegramBotClient(builder.Configuration["TelegramBotToken"]));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BirthdayTrackDbContext>(
    options =>
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(BirthdayTrackDbContext)));
    });

builder.Services.AddScoped<IUsersAllInfoRepository,UsersAllInfoRepository>();
builder.Services.AddScoped<IUsersAllInfoService, UsersAllInfoService>();

builder.Services.AddSingleton<IHostedService>(provider =>
    new TelegramBotService(
        provider.GetRequiredService<ITelegramBotClient>(),
        provider.GetRequiredService<IServiceScopeFactory>()));

builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(policy =>
{
    policy.WithHeaders().AllowAnyHeader();
    policy.WithOrigins("http://localhost:3000");
    policy.WithMethods().AllowAnyMethod();
});


app.Run();
