using Best_UI_React_App.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Best_UI_React_App.Mail_Services
{
    public interface IMailService
    {
        Task SendEmailAsync(MailRequest mailRequest);

        bool SendWelcomeEmail(WelcomeRequest request, out string errorResult);

        bool SendPasswordLinkToEmail(WelcomeRequest request, out string errorResult);

        Task<bool> SendWelcomeEmailAsync(WelcomeRequest request);

        Task<bool> SendPasswordLinkToEmailAsync(WelcomeRequest request);
    }
}
