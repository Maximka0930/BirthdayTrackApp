using BirthdayTrack.Core.Models;

namespace BirthdayTrack.Core.Abstractions
{
    public interface IUsersAllInfoRepository
    {
        Task<Guid> Create(UserAllInfo user);
        Task<Guid> Delete(Guid id);
        Task<List<UserAllInfo>> Get();
        Task<Guid> Update(Guid id, string name, string surname, string patronymic, DateOnly dateofbirth, int userStatus, string wishes, string hobbies, byte[] dataImage);
    }
}