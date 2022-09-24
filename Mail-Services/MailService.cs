using Best_UI_React_App.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Best_UI_React_App.Mail_Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }

        public async Task SendEmailAsync(MailRequest mailRequest)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            email.To.Add(MailboxAddress.Parse(mailRequest.ToEmail));
            email.Subject = mailRequest.Subject;
            var builder = new BodyBuilder();
            if (mailRequest.Attachments != null)
            {
                byte[] fileBytes;
                foreach (var file in mailRequest.Attachments)
                {
                    if (file.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                    }
                }
            }
            builder.HtmlBody = mailRequest.Body;
            email.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
        }

        public async Task<bool> SendWelcomeEmailAsync(WelcomeRequest request)
        {
            bool isResult = false;
            try
            {
                string FilePath = Directory.GetCurrentDirectory() + "\\ClientApp\\build\\EmailTemplates\\WelcomeTemplate.cshtml";
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.ToEmail).Replace("[ConfirmEmailLink]", request.ConfirmEmail);
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.To.Add(MailboxAddress.Parse(request.ToEmail));
                email.Subject = $"Welcome {request.UserName}";
                var builder = new BodyBuilder();
                builder.HtmlBody = MailText;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
                isResult = true;
                return isResult;
            }
            catch (Exception ex)
            {                
                isResult = false;
                return isResult;
            }

        }

        public async Task<bool> SendPasswordLinkToEmailAsync(WelcomeRequest request)
        {
            bool isResult = false;
            try
            {
                string FilePath = Directory.GetCurrentDirectory() + "\\ClientApp\\build\\EmailTemplates\\ResetPasswordTemplate.cshtml";
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.ToEmail).Replace("[ResetPasswordEmailLink]", request.ConfirmEmail);
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.To.Add(MailboxAddress.Parse(request.ToEmail));
                email.Subject = $"Welcome {request.UserName}";
                var builder = new BodyBuilder();
                builder.HtmlBody = MailText;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
                isResult = true;
                return isResult;
            }
            catch (Exception ex)
            {                
                isResult = false;
                return isResult;
            }

        }
        
        public bool SendPasswordLinkToEmail(WelcomeRequest request, out string errorResult)
        {
            bool isResult = false;
            try
            {
                //string FilePath = Directory.GetCurrentDirectory() + "\\ClientApp\\public\\EmailTemplates\\ResetPasswordTemplate.cshtml"; For Local
                string FilePath = Directory.GetCurrentDirectory() + "\\ClientApp\\build\\EmailTemplates\\ResetPasswordTemplate.cshtml"; // For Azure                
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.ToEmail).Replace("[ResetPasswordEmailLink]", request.ConfirmEmail);
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.To.Add(MailboxAddress.Parse(request.ToEmail));
                email.Subject = $"Welcome {request.UserName}";
                var builder = new BodyBuilder();
                builder.HtmlBody = MailText;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                smtp.Send(email);
                smtp.Disconnect(true);
                isResult = true;
                errorResult = string.Empty;
                return isResult;
            }
            catch (Exception ex)
            {
                errorResult = ex.Message;
                isResult = false;
                return isResult;
            }

        }

        //Wrote this method for testing purpose
        public bool SendWelcomeEmail(WelcomeRequest request, out string errorResult)
        {
            bool isResult = false;
            try
            {
                //string FilePath = Directory.GetCurrentDirectory() + "\\ClientApp\\public\\EmailTemplates\\WelcomeTemplate.cshtml"; For Local
                string FilePath = Directory.GetCurrentDirectory() + "\\ClientApp\\build\\EmailTemplates\\WelcomeTemplate.cshtml"; // For Azure
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                MailText = MailText.Replace("[username]", request.UserName).Replace("[email]", request.ToEmail).Replace("[ConfirmEmailLink]", request.ConfirmEmail);
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
                email.To.Add(MailboxAddress.Parse(request.ToEmail));
                email.Subject = $"Welcome {request.UserName}";
                var builder = new BodyBuilder();
                builder.HtmlBody = MailText;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                smtp.Send(email);
                smtp.Disconnect(true);
                isResult = true;
                errorResult = string.Empty;
                return isResult;
            }
            catch (Exception ex)
            {
                errorResult = ex.Message;
                isResult = false;
                return isResult;
            }

        }
    }
}
