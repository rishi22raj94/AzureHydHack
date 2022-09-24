using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Best_UI_React_App.Azure_Services
{
    public interface IAzureUploadServices
    {
        Task<JsonResult> UploadImageToAzureStorage(IFormFile file, string uniqueFileName, string retrievedFileName);

        Task<FileResult> DownloadAFileFromAzureStorage(String fileName);

        Task<bool> FileExists(string fileName);

        Task<JsonResult> GetAzureSignedUrlForAFile(String fileName);
    }
}
