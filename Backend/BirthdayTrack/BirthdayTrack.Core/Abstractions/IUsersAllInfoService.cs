using BirthdayTrack.Core.Models;

namespace BirthdayTrack.Core.Abstractions
{
    public interface IUsersAllInfoService
    {
        Task<Guid> CreateUser(UserAllInfo user);
        Task<Guid> DeleteUser(Guid id);
        Task<List<UserAllInfo>> GetAllUsers();
        Task<Guid> UpdateUser(Guid id, string name, string surname, string patronymic, DateOnly dateofbirth, int userStatus, string wishes, string hobbies, byte[] dataImage);
    }
}