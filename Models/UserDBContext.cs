using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Best_UI_React_App.Models
{
    public class UserDBContext : IdentityDbContext<User>
    {
        public UserDBContext(DbContextOptions<UserDBContext> options) : base(options)
        {

        }
        public DbSet<User> AppUsers { get; set; }

        public DbSet<IdentityUserLogin<string>> ExternalUserLogins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
            .Property(b => b.UserId).ValueGeneratedOnAdd()
            .Metadata.SetAfterSaveBehavior(PropertySaveBehavior.Ignore);

            modelBuilder.Entity<User>()
           .HasIndex(u => u.Email)
           .IsUnique();

            modelBuilder.Entity<User>()
           .HasIndex(u => u.NormalizedEmail)
           .IsUnique();
        }
    }
}
