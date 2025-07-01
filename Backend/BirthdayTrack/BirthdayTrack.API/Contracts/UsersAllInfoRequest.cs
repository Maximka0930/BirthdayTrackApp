namespace BirthdayTrack.API.Contracts
{
    public record UsersAllInfoRequest(
    string Name,
    string SurName,
    string Patronymic,
    DateOnly DateOfBirth,
    int UserStatus,
    string Wishes,
    string Hobbies,
    byte[] DataImage);
}
