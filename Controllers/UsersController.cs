using Best_UI_React_App.Azure_Services;
using Best_UI_React_App.DB_Services;
using Best_UI_React_App.ExtensionMethods;
using Best_UI_React_App.Mail_Services;
using Best_UI_React_App.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Best_UI_React_App.Controllers
{
    [ApiController]
    [Route("[controller]/[action]")]
    public class UsersController : ControllerBase
    {
        private readonly UserDBContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ILogger<UsersController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMailService _mailService;
        private AzureImageResponse signedUrlForImageResponse;
        private AzureImageResponse uploadedImageResponse;
        private IAzureUploadServices _uploadServices;
        private IDBUser_Services _dbServices;

        public UsersController(UserDBContext context, UserManager<User> userManager, SignInManager<User> signInManager, IConfiguration configuration, IAzureUploadServices uploadServices, IDBUser_Services dbServices, ILogger<UsersController> logger, IMailService mailService)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            signedUrlForImageResponse = new AzureImageResponse();
            uploadedImageResponse = new AzureImageResponse();
            _uploadServices = uploadServices;
            _dbServices = dbServices;
            _logger = logger;
            _mailService = mailService;
        }

        // GET: Users
        public async Task<JsonResult> Index()
        {
            return new JsonResult(await _context.AppUsers.ToListAsync());
        }

        //GET: Users/Details/5
        public async Task<IActionResult> Details(string id)
        {
            string decryptedId = id.ToString().DecryptNumber();
            int userID = Convert.ToInt32(decryptedId);

            if (!UserExists(userID))
            {
                return new JsonResult(new { userDetails_successful = false, userExists = false });
            }

            var user = _context.AppUsers
                                .Where(u => u.UserId == userID)
                                .Select(x => new
                                {
                                    x.Name,
                                    x.City,
                                    x.Email
                                }).ToList();

            if (user == null)
            {
                return new JsonResult(new { userDetails_successful = false, userExists = false });
            }

            return new JsonResult(new { userDetails_successful = true, userDetails = user });
        }

        // GET: Users/Create
        public JsonResult Create()
        {
            return new JsonResult(new { success = true });
        }

        // POST: Users/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var identityUser = new User { UserName = user.Name, Email = user.Email, NormalizedEmail = user.Email.ToUpper(), City = user.City, Promotions = user.Promotions, Name = user.Name, IsUserActive = true };
                    var result = await _userManager.CreateAsync(identityUser, user.Password);
                    List<string> error = new List<string>();
                    if (result.Succeeded)
                    {
                        var token = HttpUtility.UrlEncode(await _userManager.GenerateEmailConfirmationTokenAsync(identityUser));

                        var confirmationLink = Url.Action("ConfirmEmail", "SignIn",
                            new { userId = identityUser.Id, token = token }, Request.Scheme);                                             
                           
                        WelcomeRequest welcomeRequest = new WelcomeRequest() { ConfirmEmail = confirmationLink, ToEmail = user.Email, UserName = user.Name };
                        string errorResult = string.Empty;
                        var welcomeRequestResult = _mailService.SendWelcomeEmail(welcomeRequest, out errorResult);
                        
                        //_logger.Log(Microsoft.Extensions.Logging.LogLevel.Warning, confirmationLink);
                        if (welcomeRequestResult && String.IsNullOrEmpty(errorResult))
                        {
                            await _signInManager.SignInAsync(identityUser, isPersistent: false);
                            return new JsonResult(new { registration_successful = true, Email = user.Email });
                        }
                        else
                        {
                            string errorResultForDeletingUser = string.Empty;
                            bool deleteUserResult = _dbServices.DeleteUser(identityUser.Id, out errorResultForDeletingUser);
                            if(deleteUserResult && String.IsNullOrEmpty(errorResultForDeletingUser))
                            {
                                return new JsonResult(new { registration_successful = false, error_data = $"Internal server error: Unable To Send Email Confirmation Link To User Mail Address. 'Exception Message - {errorResult}'" });
                            }
                            else
                            {
                                return new JsonResult(new { registration_successful = false, error_data = $"Internal server error: Unable To Send Email Confirmation Link To User Mail Address And Unable to Delete the user." });
                            }
                        }
                    }
                    else
                    {
                        foreach (var err in result.Errors)
                            error.Add(err.Description);
                    }


                    return new JsonResult(new { registration_successful = false, error_data = error.ToList() });                    
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { registration_successful = false, error_data = $"Internal server error: {ex.Message}" });
            }

            return new JsonResult(new { registration_successful = false, error_data = "Internal server error" });
        }

        // GET: Users/Edit/5
        //public async Task<IActionResult> Edit(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var user = await _context.Users.FindAsync(id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }
        //    return new JsonResult(user);
        //}

        // POST: Users/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.

        [HttpPut]
        public async Task<IActionResult> Edit([FromForm] User user)
        {
            try
            {
                if (user != null)
                {
                    var tasks = new List<Task<JsonResult>>();

                    string uniqueFileName = string.Empty;
                    string decryptedId = user.Id.ToString().DecryptNumber();
                    int userID = Convert.ToInt32(decryptedId);
                    string fileNameGotRetrieved = string.Empty;
                    RetrievedFileName(userID, out fileNameGotRetrieved);

                    if (user.File != null)
                    {
                        uniqueFileName = "user-profile-image" + "/" + DateTime.Now.ToString("yymmssfff") + "-" + user.File.FileName.ToLower();

                        tasks.Add(Task.Run(() => _uploadServices.UploadImageToAzureStorage(user.File, uniqueFileName, fileNameGotRetrieved)));

                        await Task.WhenAll(tasks);

                        var uploadImageResult = tasks[0].Result.Value;

                        string uploadImageResultJson = JsonConvert.SerializeObject(uploadImageResult);
                        uploadedImageResponse = JsonConvert.DeserializeObject<AzureImageResponse>(uploadImageResultJson);

                        if (uploadedImageResponse.status)
                        {
                            tasks.Add(Task.Run(() => _uploadServices.GetAzureSignedUrlForAFile(uniqueFileName)));
                            await Task.WhenAll(tasks);
                            var signedUrlForImageResult = tasks[1].Result.Value;
                            string signedUrlForImageResultJson = JsonConvert.SerializeObject(signedUrlForImageResult);
                            signedUrlForImageResponse = JsonConvert.DeserializeObject<AzureImageResponse>(signedUrlForImageResultJson);
                        }
                    }
                    else
                    {
                        if (!String.IsNullOrEmpty(fileNameGotRetrieved))
                        {
                            tasks.Add(Task.Run(() => _uploadServices.GetAzureSignedUrlForAFile(fileNameGotRetrieved)));
                            await Task.WhenAll(tasks);
                            var signedUrlForImageResult = tasks[0].Result.Value;
                            string signedUrlForImageResultJson = JsonConvert.SerializeObject(signedUrlForImageResult);
                            signedUrlForImageResponse = JsonConvert.DeserializeObject<AzureImageResponse>(signedUrlForImageResultJson);
                        }
                    }

                    if (!UserExists(userID))
                    {
                        return new JsonResult(new { userDetails_successful = false, userExists = false });
                    }

                    if (ModelState.IsValid)
                    {
                        try
                        {
                            bool result = false;
                            bool fileName = false;
                            if (uploadedImageResponse.status && signedUrlForImageResponse.status)
                            {
                                fileName = true;
                                result = Update(user, userID, uniqueFileName);
                            }
                            else
                            {
                                fileName = false;
                                result = Update(user, userID);
                            }
                            if (result)
                            {
                                UserUIModel userDetails = null;
                                userDetails = _context.AppUsers
                                            .Where(u => u.UserId == userID)
                                            .Select(x => new UserUIModel
                                            {
                                                Name = x.Name,
                                                City = x.City,
                                                Email = x.Email,
                                                FileName = x.FileName
                                            }).SingleOrDefault();

                                return new JsonResult(new { userDetails_successful = true, userDetails = userDetails, imageSrc = signedUrlForImageResponse.url });
                            }
                        }
                        catch (DbUpdateConcurrencyException)
                        {
                            if (!UserExists(userID))
                            {
                                return new JsonResult(new { userDetails_successful = false, userExists = false });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { userDetails_successful = false, error = $"Internal server error: {ex.Message}" });
            }
            return new JsonResult(new { userDetails_successful = false, userExists = false });
        }

        // GET: Users/Delete/5
        //public async Task<IActionResult> Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return NotFound();
        //    }

        //    var user = await _context.Users
        //        .FirstOrDefaultAsync(m => m.UserId == id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    return new JsonResult(user);
        //}

        // POST: Users/Delete/5

        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> DeleteConfirmed(int id)
        //{
        //    var user = await _context.AppUsers.FindAsync(id);
        //    _context.AppUsers.Remove(user);
        //    await _context.SaveChangesAsync();
        //    return RedirectToAction(nameof(Index));
        //}

        [HttpDelete]
        public IActionResult DeleteUser(string deleteRecordId)
        {
            try
            {
                if (!String.IsNullOrEmpty(deleteRecordId))
                {
                    string decryptedId = deleteRecordId.ToString().DecryptNumber();
                    int userID = Convert.ToInt32(decryptedId);
                    try
                    {
                        var userData = _context.AppUsers.Where(x => x.UserId == userID).FirstOrDefault();
                        userData.IsUserActive = false;
                        _context.SaveChanges();
                        return new JsonResult(new { userDeleted_successful = true });
                    }
                    catch (DbUpdateConcurrencyException e)
                    {
                        return new JsonResult(new { userDeleted_successful = false, error = $"Internal server error: {e.Message}" });
                    }
                }
                else
                {
                    return new JsonResult(new { userDeleted_successful = false, error = "UserId is null" });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(new { userDetails_successful = false, error = $"Internal server error: {ex.Message}" });
            }
        }

        private void RetrievedFileName(int userID, out string filename)
        {
            dynamic userDetailsForRetrievalFileName = null;
            userDetailsForRetrievalFileName = _context.AppUsers
                    .Where(u => u.UserId == userID)
                    .Select(x => new
                    {
                        x.FileName
                    }).ToList();

            if (userDetailsForRetrievalFileName != null)
            {
                filename = userDetailsForRetrievalFileName[0].FileName;
            }
            else
            {
                filename = string.Empty;
            }
        }

        private bool UserExists(int id)
        {
            return _context.AppUsers.Any(e => e.UserId == id);
        }

        private bool Update(User item, int id, string fileName = "")
        {
            try
            {
                if (!String.IsNullOrEmpty(fileName))
                {
                    var user = _context.AppUsers.Where(x => x.UserId == id).FirstOrDefault();
                    if (UpdateUserDetails(item, user))
                    {
                        user.FileName = fileName;
                        _context.SaveChanges();
                    }
                }
                else
                {
                    var user = _context.AppUsers.Where(x => x.UserId == id).FirstOrDefault();
                    if (UpdateUserDetails(item, user))
                        _context.SaveChanges();
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private bool UpdateUserDetails(User source, User destination)
        {
            try
            {
                if (!String.IsNullOrEmpty(source.Name))
                    destination.Name = source.Name;
                if (!String.IsNullOrEmpty(source.City))
                    destination.City = source.City;
                if (!String.IsNullOrEmpty(source.Email))
                    destination.Email = source.Email;

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
