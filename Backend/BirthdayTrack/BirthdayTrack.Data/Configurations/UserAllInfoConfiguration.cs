using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BirthdayTrack.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BirthdayTrack.Data.Configurations
{
    public class UserAllInfoConfiguration : IEntityTypeConfiguration<UserAllInfo>
    {
        public void Configure(EntityTypeBuilder<UserAllInfo> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(b => b.Name)
                .HasMaxLength(UserAllInfo.MAX_LENGTH)
                .IsRequired();
            builder.Property(b => b.SurName)
                .HasMaxLength(UserAllInfo.MAX_LENGTH)
                .IsRequired();
            builder.Property(b => b.Patronymic)
                .HasMaxLength(UserAllInfo.MAX_LENGTH)
                .IsRequired();
            builder.Property(b => b.Wishes)
                .HasMaxLength(UserAllInfo.MAX_LENGTH)
                .IsRequired();
            builder.Property(b => b.Hobbies)
                .HasMaxLength(UserAllInfo.MAX_LENGTH)
                .IsRequired();

        }
    }
}
