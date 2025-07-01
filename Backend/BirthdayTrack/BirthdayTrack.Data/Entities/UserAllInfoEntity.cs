namespace BirthdayTrack.Data.Entities
{
    public class UserAllInfoEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SurName { get; set; } = string.Empty;
        public string Patronymic { get; set; } = string.Empty;
        public DateOnly DateOfBirth { get; set; }
        public int UserStatus { get; set; }
        public string Wishes { get; set; } = string.Empty;
        public string Hobbies { get; set; } = string.Empty;
        public byte[] DataImage { get; set; } = [];
    }



}
