using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.AspNetCore.Mvc.Core;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Best_UI_React_App.Models;
using Microsoft.AspNetCore.Identity;
using Best_UI_React_App.Azure_Services;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;

namespace Best_UI_React_App.Controllers
{
    public class ErrorController : Controller
    {
        [AllowAnonymous]
        [Route("Error")]
        public IActionResult Error()
        {
            // Retrieve the exception Details
            var exceptionHandlerPathFeature =
                    HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            var ExceptionPath = exceptionHandlerPathFeature.Path;
            var ExceptionMessage = exceptionHandlerPathFeature.Error.Message;
            var StackTrace = exceptionHandlerPathFeature.Error.StackTrace;
            
            return new JsonResult(new { ExceptionPath = ExceptionPath, ExceptionMessage = ExceptionMessage, StackTrace= StackTrace });// In Future set the logging to application Insights
        }
    }
}
