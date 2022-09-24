using Best_UI_React_App.Azure_Services;
using Best_UI_React_App.DB_Services;
using Best_UI_React_App.ExtensionMethods;
using Best_UI_React_App.Mail_Services;
using Best_UI_React_App.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using NuGet.Common;
using NuGet.Protocol.Plugins;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;

namespace Best_UI_React_App.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class SignInController : Controller
    {
        private readonly ILogger<SignInController> _logger;// In Future set the logging to application Insights
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly UserDBContext _context;
        private AzureImageResponse signedUrlForImageResponse;
        private IAzureUploadServices _uploadServices;
        private readonly IMailService _mailService;
        private IDBUser_Services _dbServices;

        public SignInController(ILogger<SignInController> logger, SignInManager<User> signInManager, UserManager<User> userManager, UserDBContext context, IAzureUploadServices uploadServices, IDBUser_Services dbServices, IMailService mailService)
        {
            _logger = logger;
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;
            signedUrlForImageResponse = new AzureImageResponse();
            _uploadServices = uploadServices;
            _dbServices = dbServices;
            _mailService = mailService;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var result = await _signInManager.PasswordSignInAsync(login.Username, login.Password, login.RememberMe, false);
                    var username = await _userManager.FindByNameAsync(login.Username);
                    if (username != null)
                    {                        
                        var activeUserId = await _userManager.GetUserIdAsync(username);
                        var details = _context.AppUsers
                                        .Where(u => u.Id == activeUserId)
                                        .Select(x => new { x.IsUserActive, x.EmailConfirmed, x.PasswordHash, x.Email }).SingleOrDefault();

                        if (result.Succeeded && details.IsUserActive && details.EmailConfirmed)
                        {
                            List<string> error = new List<string>();
                            string uniqueFileName = string.Empty;
                            var userDetails = _dbServices.CallingUserDetails(details.Email);
                            uniqueFileName = userDetails.Item1.FileName;

                            string imgSrcResult = _dbServices.CallingUserImgSrc(userDetails.Item1);

                            string encryptedId = userDetails.Item2.ToString().EncryptNumber();

                            if (result.Succeeded && !String.IsNullOrEmpty(imgSrcResult))
                            {
                                return new JsonResult(new { login_successful = true, Username = login.Username, Id = encryptedId, userDetails = userDetails.Item1, imageSrc = imgSrcResult });
                            }
                            else if (result.Succeeded)
                            {
                                return new JsonResult(new { login_successful = true, Username = login.Username, Id = encryptedId, userDetails = userDetails.Item1, imageSrc = "" });
                            }
                        }
                        else if (String.IsNullOrEmpty(details.PasswordHash))
                        {
                            return new JsonResult(new { login_successful = false, Username = login.Username, error = "Please Sign in with Google or click on Sign Up link to activate your account." });
                        }
                        else if (details.EmailConfirmed == false)
                        {
                            return new JsonResult(new { login_successful = false, Username = login.Username, error = "User email not activated. Please activate your account by clicking on the link sent to your registered email address." });
                        }
                        else if (details.IsUserActive == false)
                        {
                            return new JsonResult(new { login_successful = false, Username = login.Username, error = "User got deleted. Please register again." });
                        }
                        else
                        {
                            return new JsonResult(new { login_successful = false, Username = login.Username, error = "Login Failed. Please try again with valid credentials" });
                        }
                    }
                    else
                    {
                        return new JsonResult(new { login_successful = false, error = $"User is not found. {login.Username.ToUpper()} please register yourself." });
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { login_successful = false, error = $"Internal server error: {ex.Message}" });
            }

            return new JsonResult(new { login_successful = false, error = "Login Failed" });
        }

        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (userId == null || token == null)
            {
                ViewBag.ErrorMessage = $"The User ID is invalid";
                return View("Error");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                ViewBag.ErrorMessage = $"The User ID {userId} is invalid";
                return View("Error");
            }

            string decodedToken = HttpUtility.UrlDecode(token);
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (result.Succeeded)
            {
                return View();
            }

            ViewBag.ErrorMessage = "Email cannot be confirmed";
            return View("Error");
        }        

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPassword(string email, string token)
        {
            if (email == null || token == null)
            {
                ViewBag.ErrorMessage = $"The email is invalid";
                return View("ResetPasswordErrorPage");
            }

            var model = new ForgotPassword { Token = token, Email = email };
            return View(model);            
        }

        [HttpPost]        
        public async Task<IActionResult> ResetPassword(ForgotPassword forgotPasswordModel)
        {
            if (!ModelState.IsValid)
                return View(forgotPasswordModel);
            var user = await _userManager.FindByEmailAsync(forgotPasswordModel.Email);
            if (user == null)
                RedirectToAction(nameof(ResetPasswordSuccessful));
            string decodedToken = HttpUtility.UrlDecode(forgotPasswordModel.Token);
            var resetPassResult = await _userManager.ResetPasswordAsync(user, decodedToken, forgotPasswordModel.NewPassword);
            List<string> errors = new List<string>();
            if (!resetPassResult.Succeeded)
            {
                foreach (var error in resetPassResult.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                    errors.Add(error.Description);
                }
                return new JsonResult(new { forgotPasswordModel, errors });                
            }
            return new JsonResult(new { status = "success", email = forgotPasswordModel.Email });            
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetPasswordSuccessful(string email)
        {
            if (email == null)
            {
                ViewBag.ErrorMessage = $"The email is invalid";
                return View("ResetPasswordErrorPage");
            }

            ViewBag.Email = email;
            
            return View();
        }      

        [HttpPost]
        public async Task<IActionResult> ExternalLogin([FromBody] Object userObj)
        {
            try
            {
                if (userObj != null)
                {
                    var data = JsonConvert.DeserializeObject<dynamic>(userObj.ToString());
                    string email = data.email;
                    string name = data.displayName;                      
                    string providerKey = data.providerData[0].uid;
                    string loginProvider = data.providerData[0].providerId;

                    //If the user already has a login(i.e if there is a record in AspNetUserLogins
                    // table) then sign-in the user with this external login provider
                    var signInResult = await _signInManager.ExternalLoginSignInAsync(loginProvider,
                        providerKey, isPersistent: false, bypassTwoFactor: true);

                    if (signInResult.Succeeded)
                    {
                        var externalUserGUID = _context.ExternalUserLogins
                                        .Where(u => u.ProviderKey == providerKey)
                                        .Select(x => new User
                                        {
                                            Id = x.UserId,
                                        }).SingleOrDefault();

                        var user_UserName = _context.AppUsers
                                           .Where(u => u.Id == externalUserGUID.Id)
                                           .Select(x => new User { Name = x.Name }).SingleOrDefault();

                        var user_IsUserActive = _context.AppUsers
                                           .Where(u => u.Id == externalUserGUID.Id)
                                           .Select(x => new User { IsUserActive = x.IsUserActive }).SingleOrDefault();

                        if (user_IsUserActive.IsUserActive)
                        {
                            var userDetails = _dbServices.CallingUserDetails(user_UserName.Email);

                            string imgSrcResult = _dbServices.CallingUserImgSrc(userDetails.Item1);

                            if (!String.IsNullOrEmpty(imgSrcResult))
                            {
                                return new JsonResult(new { login_successful = true, Username = user_UserName.Name, Id = userDetails.Item2.ToString().EncryptNumber(), userDetails = userDetails.Item1, imageSrc = imgSrcResult });
                            }                            
                            else
                            {
                                return new JsonResult(new { login_successful = true, Username = user_UserName.Name, Id = userDetails.Item2.ToString().EncryptNumber(), userDetails = userDetails.Item1, imageSrc = "" });
                            }
                        }
                        else
                        {
                            return new JsonResult(new { login_successful = false, Username = user_UserName.Name, error = "User got deleted. Please register again." });
                        }                                              
                    }

                    // If there is no record in AspNetUserLogins table, the user may not have
                    // a local account
                    else
                    {
                        if (email != null)
                        {
                            // Create a new user without password if we do not have a user already
                            var user = await _userManager.FindByEmailAsync(email);

                            if (user == null)
                            {
                                user = new User
                                {
                                    UserName = name,
                                    Email = email,
                                    NormalizedEmail = email.ToUpper(),
                                    Name = name,
                                    IsUserActive = true
                                };
                                
                                IdentityResult result = await _userManager.CreateAsync(user);
                                if (!result.Succeeded)
                                {
                                    foreach (IdentityError error in result.Errors)
                                        return new JsonResult(new { login_successful = false, error = $"Oops! {error.Description} : {error.Code} From Google" });                                    
                                }                                    
                            }

                            // Add a login (i.e insert a row for the user in AspNetUserLogins table)
                            await _userManager.AddLoginAsync(user, new UserLoginInfo(loginProvider, providerKey, name));
                            await _signInManager.SignInAsync(user, isPersistent: false);

                            var userDetails = _dbServices.CallingUserDetails(user.Email);

                            string imgSrcResult = _dbServices.CallingUserImgSrc(userDetails.Item1);                            

                            if (!String.IsNullOrEmpty(imgSrcResult))
                            {                                
                                return new JsonResult(new { login_successful = true, Username = user.UserName, Id = userDetails.Item2.ToString().EncryptNumber(), userDetails = userDetails.Item1, imageSrc = imgSrcResult });
                            }                            
                            else
                            {
                                return new JsonResult(new { login_successful = true, Username = user.UserName, Id = userDetails.Item2.ToString().EncryptNumber(), userDetails = userDetails.Item1, imageSrc = "" });
                            }
                        }

                        return new JsonResult(new { login_successful = false, error = $"Email not received from: {loginProvider}"});
                    }
                }
                else
                {
                    return new JsonResult(new { login_successful = false, error = $"External login provider user object is null" });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { login_successful = false, error = $"Internal server error: {ex.Message}" });
            }            
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPassword([FromBody] EmailRequest email)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    // Find the user by email
                    var user = await _userManager.FindByEmailAsync(email.Email);
                    List<string> errors = new List<string>();
                    // If the user is found
                    if (user != null && await _userManager.IsEmailConfirmedAsync(user))
                    {                                                                                      
                            // Generate the reset password token
                            var token = HttpUtility.UrlEncode(await _userManager.GeneratePasswordResetTokenAsync(user));
                            var passwordLink = string.Empty;

                            if (token != null)
                            {
                                passwordLink = Url.Action("ResetPassword", "SignIn", new { email = email.Email, token = token }, Request.Scheme);
                            }
                            
                            WelcomeRequest welcomeRequest = new WelcomeRequest() { ConfirmEmail = passwordLink, ToEmail = user.Email, UserName = user.Name };
                            string errorResult = string.Empty;
                            var passwordRequestResult = _mailService.SendPasswordLinkToEmail(welcomeRequest, out errorResult);                            

                        if (passwordRequestResult && String.IsNullOrEmpty(errorResult))
                        {
                            await _signInManager.SignInAsync(user, isPersistent: false);
                            return new JsonResult(new { resetpassword_successful = true, Email = user.Email });
                        }
                        else
                        {
                            return new JsonResult(new { resetpassword_successful = false, error_data = $"Internal server error: Unable To Send Email Confirmation Link To User Mail Address. 'Exception Message - {errorResult}'" });
                        }                                                         
                                                
                        // Log the password reset link
                        //_logger.Log(LogLevel.Warning, passwordResetLink);// In Future set the logging to application Insights                        
                    }

                    // To avoid account enumeration and brute force attacks, don't
                    // reveal that the user does not exist or is not confirmed
                    return new JsonResult(new { resetpassword_successful = false, error_data = errors.ToList() });
                }
                else
                {
                    return new JsonResult(new { resetpassword_successful = false, error_data = "Email field is null." });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { resetpassword_successful = false, error_data = $"Internal server error: {ex.Message}" });
            }

            return new JsonResult(new { resetpassword_successful = false, error_data = "Resetting password got failed." });
        }

        [HttpGet]
        public JsonResult UserDetails([FromBody] User user)
        {
            return new JsonResult(new { email = user.Email, isreceived = true });
        }

        [HttpPost]
        public JsonResult Register([FromBody] User user)
        {
            return new JsonResult(new { email = user.Email, isreceived = true });
        }

        [HttpPut]
        public JsonResult UpdateUserDetails([FromBody] User user)
        {
            return new JsonResult(new { email = user.Email, isreceived = true });
        }

        [HttpDelete]
        public JsonResult DeleteUser([FromBody] User user)
        {
            return new JsonResult(new { email = user.Email, isreceived = true });
        }

        
    }
}
