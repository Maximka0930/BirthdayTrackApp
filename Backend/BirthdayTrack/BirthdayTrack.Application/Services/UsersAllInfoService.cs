using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BirthdayTrack.Core.Abstractions;
using BirthdayTrack.Core.Models;

namespace BirthdayTrack.Application.Services
{
    public class UsersAllInfoService : IUsersAllInfoService
    {
        private readonly IUsersAllInfoRepository _usersAllInfoRepository;
        public UsersAllInfoService(IUsersAllInfoRepository usersAllInfoRepository)
        {
            _usersAllInfoRepository = usersAllInfoRepository;
        }

        public async Task<List<UserAllInfo>> GetAllUsers()
        {
            return await _usersAllInfoRepository.Get();
        }

        public async Task<Guid> CreateUser(UserAllInfo user)
        {
            return await _usersAllInfoRepository.Create(user);
        }

        public async Task<Guid> UpdateUser(Guid id, string name, string surname, string patronymic, DateOnly dateofbirth, int userStatus, string wishes, string hobbies, byte[] dataImage)
        {
            return await _usersAllInfoRepository.Update(id, name, surname, patronymic, dateofbirth, userStatus, wishes, hobbies, dataImage);
        }

        public async Task<Guid> DeleteUser(Guid id)
        {
            return await _usersAllInfoRepository.Delete(id);
        }
    }
}
