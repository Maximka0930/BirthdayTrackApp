using BirthdayTrack.Core.Models;
using BirthdayTrack.Data.Configurations;
using BirthdayTrack.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace BirthdayTrack.Data
{
    public class BirthdayTrackDbContext : DbContext 
    {
        public BirthdayTrackDbContext(DbContextOptions<BirthdayTrackDbContext> options) : base(options) { }
        public DbSet<UserAllInfoEntity> UsersAllInfo { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserAllInfoConfiguration());
            base.OnModelCreating(modelBuilder);
        }
    }
}
