using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BirthdayTrack.Core.Models
{
    public class UserAllInfo
    {
        public const int MAX_LENGTH = 100;
        private UserAllInfo(Guid id, string name, string surName, string patronymic, DateOnly dateOfBirth, int userStatus, string wishes, string hobbies, byte[] dataImage)
        {
            Id = id;
            Name = name;
            SurName = surName;
            Patronymic = patronymic;
            DateOfBirth = dateOfBirth;
            UserStatus = userStatus;
            Wishes = wishes;
            Hobbies = hobbies;
            DataImage = dataImage;
        }
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SurName { get; set; } = string.Empty;
        public string Patronymic { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public int UserStatus { get; set; }
        public string Wishes { get; set; }
        public string Hobbies { get; set; }
        public byte[] DataImage { get; set; } = [];


        public static UserAllInfo
            Create(Guid id, string name, string surname, string patronymic, DateOnly dateofbirth, int userStatus, string wishes, string hobbies, byte[] dataImage)
        {
            var user = new UserAllInfo(id, name, surname, patronymic, dateofbirth,userStatus,wishes,hobbies,dataImage);
            return user;
        }

    }
}
