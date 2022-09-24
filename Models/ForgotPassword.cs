using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Best_UI_React_App.Models
{
    public class ForgotPassword
    {
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("NewPassword",
            ErrorMessage = "Password and Confirm Password must match")]
        public string ConfirmPassword { get; set; }

        public string Token { get; set; }
    }
}
