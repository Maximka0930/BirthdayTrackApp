using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BirthdayTrack.Core.Abstractions;
using BirthdayTrack.Core.Models;
using BirthdayTrack.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BirthdayTrack.Data.Repositories
{
    public class UsersAllInfoRepository : IUsersAllInfoRepository
    {
        private readonly BirthdayTrackDbContext _db;
        public UsersAllInfoRepository(BirthdayTrackDbContext db)
        {
            _db = db;
        }

        public async Task<List<UserAllInfo>> Get()
        {
            var userEntities = await _db.UsersAllInfo
                .AsNoTracking()
                .ToListAsync();
            return userEntities
                .Select(u => UserAllInfo.Create(u.Id, u.Name, u.SurName, u.Patronymic, u.DateOfBirth, u.UserStatus, u.Wishes, u.Hobbies, u.DataImage))
                .ToList();

        }
        public async Task<Guid> Create(UserAllInfo user)
        {
            var usersEntity = new UserAllInfoEntity
            {
                Id = user.Id,
                Name = user.Name,
                SurName = user.SurName,
                Patronymic = user.Patronymic,
                DateOfBirth = user.DateOfBirth,
                UserStatus = user.UserStatus,
                Wishes = user.Wishes,
                Hobbies = user.Hobbies,
                DataImage = user.DataImage
            };

            await _db.UsersAllInfo.AddAsync(usersEntity);
            await _db.SaveChangesAsync();
            return usersEntity.Id;
        }
        public async Task<Guid> Update(Guid id, string name, string surname, string patronymic, DateOnly dateofbirth, int userStatus, string wishes, string hobbies, byte[] dataImage)
        {
            await _db.UsersAllInfo
                .Where(u => u.Id == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.Name, name)
                    .SetProperty(u => u.SurName, surname)
                    .SetProperty(u => u.Patronymic, patronymic)
                    .SetProperty(u => u.DateOfBirth, dateofbirth)
                    .SetProperty(u => u.UserStatus, userStatus)
                    .SetProperty(u => u.Wishes, wishes)
                    .SetProperty(u => u.Hobbies, hobbies)
                    .SetProperty(u => u.DataImage, dataImage));
            return id;
        }
        public async Task<Guid> Delete(Guid id)
        {
            await _db.UsersAllInfo
                .Where(u => u.Id == id)
                .ExecuteDeleteAsync();
            return id;
        }
    }
}
