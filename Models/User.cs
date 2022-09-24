using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Best_UI_React_App.Models
{
    public class User: IdentityUser
    {        
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]        
        public int UserId { get; set; }        
        public string Name { get; set; }
        public string Password { get; set; }
        public string City { get; set; }
        public bool Promotions { get; set; }
        public bool IsUserActive { get; set; }

        public string FileName { get; set; }

        [NotMapped]
        public string Auth { get; set; }

        [NotMapped]            
        public IFormFile File { get; set; }
    }
}
