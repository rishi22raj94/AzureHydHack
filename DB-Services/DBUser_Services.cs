using Azure.Core;
using Best_UI_React_App.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using Best_UI_React_App.Azure_Services;
using Best_UI_React_App.ExtensionMethods;
using Microsoft.EntityFrameworkCore;

namespace Best_UI_React_App.DB_Services
{
    public class DBUser_Services: ControllerBase, IDBUser_Services
    {
        //private readonly ILogger<SignInController> _logger;// In Future set the logging to application Insights
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly UserDBContext _context;
        private AzureImageResponse signedUrlForImageResponse;
        private IAzureUploadServices _uploadServices;

        public DBUser_Services()
        {
                      
        }

        public DBUser_Services(SignInManager<User> signInManager, UserManager<User> userManager, UserDBContext context, IAzureUploadServices uploadServices)
        {
            //_logger = logger;
            _signInManager = signInManager;
            _userManager = userManager;
            _context = context;
            signedUrlForImageResponse = new AzureImageResponse();
            _uploadServices = uploadServices;
        }

        Tuple<UserUIModel, int> IDBUser_Services.CallingUserDetails(string email)
        {
            Tuple<UserUIModel, int> data = null;
            var taskForUserDetails = new List<Task<(UserUIModel, int)>>();
            taskForUserDetails.Add(Task.Run(() => UserDetails(email)));
            Task.WhenAll(taskForUserDetails);
            var userDetails = taskForUserDetails[0].Result;
            data = new Tuple<UserUIModel, int>(userDetails.Item1, userDetails.Item2);
            return data;
        }

        private async Task<(UserUIModel, int)> UserDetails(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var userId = await _userManager.GetUserIdAsync(user);
            int id = _context
                     .AppUsers
                     .Where(u => u.Id == userId)
                     .Select(u => u.UserId)
                     .SingleOrDefault();

            var userDetails = _context.AppUsers
                            .Where(u => u.Id == userId)
                            .Select(x => new UserUIModel
                            {
                                Name = x.Name,
                                City = x.City,
                                Email = x.Email,
                                FileName = x.FileName
                            }).SingleOrDefault();

            return (userDetails, id);
        }

        string IDBUser_Services.CallingUserImgSrc(UserUIModel userDetails)
        {
            var taskForUserImgSrc = new List<Task<string>>();
            taskForUserImgSrc.Add(Task.Run(() => UserImgSrc(userDetails)));
            Task.WhenAll(taskForUserImgSrc);
            var userImgsrc = taskForUserImgSrc[0].Result;
            return userImgsrc;
        }

        bool IDBUser_Services.DeleteUser(string deleteRecordId, out string errorResult)
        {
            var result = false;
            try
            {                
                if (!String.IsNullOrEmpty(deleteRecordId))
                {                    
                    try
                    {
                        var userData = _context.AppUsers.Where(x => x.Id == deleteRecordId).FirstOrDefault();
                        
                        if (userData == null)
                        {
                            errorResult = "User is not present";
                            return result = false;
                        }

                        _context.AppUsers.Remove(userData);
                        _context.SaveChangesAsync();

                        errorResult = String.Empty;
                        return result = true;
                    }
                    catch (DbUpdateConcurrencyException e)
                    {
                        errorResult = e.Message;
                        return result = false;
                    }
                }
                else
                {
                    errorResult = "UserId is null";
                    return result = false;
                }
            }
            catch (Exception ex)
            {
                errorResult = $"Internal server error: {ex.Message}";
                return result = false;
            }
        }

        private async Task<string> UserImgSrc(UserUIModel userDetails)
        {
            string imgsrc = string.Empty;
            var tasks = new List<Task<JsonResult>>();
            var taskForFileExists = new List<Task<bool>>();
            if (userDetails != null && !String.IsNullOrEmpty(userDetails.FileName))
            {
                taskForFileExists.Add(Task.Run(() => _uploadServices.FileExists(userDetails.FileName)));
                await Task.WhenAll(taskForFileExists);
                var fileExistsResult = taskForFileExists[0].Result;

                if (fileExistsResult)
                {
                    tasks.Add(Task.Run(() => _uploadServices.GetAzureSignedUrlForAFile(userDetails.FileName)));
                    await Task.WhenAll(tasks);
                    var signedUrlForImageResult = tasks[0].Result.Value;
                    string signedUrlForImageResultJson = JsonConvert.SerializeObject(signedUrlForImageResult);
                    signedUrlForImageResponse = JsonConvert.DeserializeObject<AzureImageResponse>(signedUrlForImageResultJson);
                    if (signedUrlForImageResponse.status)
                    {
                        imgsrc = signedUrlForImageResponse.url;
                    }
                    else
                    {
                        imgsrc = string.Empty;
                    }
                }
            }
            return imgsrc;
        }       
    }
}
