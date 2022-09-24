using Azure.Core;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Best_UI_React_App.Azure_Services
{
    public class AzureUploadServices: ControllerBase, IAzureUploadServices
    {
        private Task<Tuple<string, string, string>> _connection = null;        

        public AzureUploadServices()
        {
            _connection = (Task.Run(() => GetInstrumentationKey()));
            _connection.Wait();            
        }

        public async Task<JsonResult> UploadImageToAzureStorage(IFormFile file, string uniqueFileName, string retrievedFileName)
        {
            try
            {
                if (file != null)
                {                    
                    var container = new BlobContainerClient(_connection.Result.Item1, "reactapp");
                    var createResponse = await container.CreateIfNotExistsAsync();
                    if (createResponse != null && createResponse.GetRawResponse().Status == 201)
                        await container.SetAccessPolicyAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);
                    var blob = container.GetBlobClient(uniqueFileName);
                    if (!String.IsNullOrEmpty(retrievedFileName))
                    {
                        await DeleteAFileFromAzureStorage(retrievedFileName);
                    }                        
                    await blob.DeleteIfExistsAsync(Azure.Storage.Blobs.Models.DeleteSnapshotsOption.IncludeSnapshots);
                    using (var fileStream = file.OpenReadStream())
                    {
                        await blob.UploadAsync(fileStream, new BlobHttpHeaders { ContentType = file.ContentType });
                    }
                    return new JsonResult(new { status = true, url = blob.Uri.ToString(), error = string.Empty });
                }
                return new JsonResult(new { status = false, url = string.Empty, error = string.Empty });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { status = false, url = string.Empty, error = $"Internal server error: {ex}" });
            }
        }

        public async Task<FileResult> DownloadAFileFromAzureStorage(String fileName)
        {            
            try
            {
                CloudBlockBlob blockBlob;
                await using (MemoryStream memoryStream = new MemoryStream())
                {
                    string blobstorageconnection = _connection.Result.Item1;
                    CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(blobstorageconnection);
                    CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
                    CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference("reactapp");
                    blockBlob = cloudBlobContainer.GetBlockBlobReference(fileName);
                    await blockBlob.DownloadToStreamAsync(memoryStream);
                }
                Stream blobStream = blockBlob.OpenReadAsync().Result;
                return File(blobStream, blockBlob.Properties.ContentType, blockBlob.Name);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> DeleteAFileFromAzureStorage(String fileName)
        {
            bool result = false;
            try
            {
                string blobstorageconnection = _connection.Result.Item1;
                CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(blobstorageconnection);
                CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();                
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference("reactapp");
                var blob = cloudBlobContainer.GetBlobReference(fileName);
                result = await blob.DeleteIfExistsAsync();                
                return result;                
            }
            catch (Exception ex)
            {
                throw;                
            }
        }

        public async Task<bool> FileExists(string fileName)
        {
            bool result = false;
            try
            {
                string blobstorageconnection = _connection.Result.Item1;
                CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(blobstorageconnection);
                CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference("reactapp");
                var blob = cloudBlobContainer.GetBlobReference(fileName);
                result = await blob.ExistsAsync();
                return result;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<JsonResult> GetAzureSignedUrlForAFile(String fileName)
        {
            try
            {                
                string accountName = _connection.Result.Item3; //storage account name
                string accountKey = _connection.Result.Item2; // storage account key 
                BlobClient blobClient2 = new BlobClient(
                                         connectionString: _connection.Result.Item1,
                                         blobContainerName: "reactapp",
                                         blobName: fileName);
                string blobContainerName = "reactapp";
                string urlAzure = $"https://{accountName}.blob.core.windows.net/{blobContainerName}";
                Azure.Storage.Sas.BlobSasBuilder blobSasBuilder = new Azure.Storage.Sas.BlobSasBuilder()
                {
                    BlobContainerName = "reactapp",// Bucket name 
                    BlobName = fileName,
                    Resource = "c",
                    StartsOn = DateTimeOffset.UtcNow,
                    ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(60)
                };

                blobSasBuilder.SetPermissions(Azure.Storage.Sas.BlobSasPermissions.All);//User will only be able to read the blob and it's properties
                var sasToken = blobSasBuilder.ToSasQueryParameters(new StorageSharedKeyCredential(accountName, accountKey)).ToString();
                return new JsonResult(new { status = true, url = blobClient2.Uri.AbsoluteUri + "?" + sasToken, error = string.Empty });
            }
            catch (Exception ex)
            {
                return new JsonResult(new { status = false, url = string.Empty, error = $"Internal server error: {ex}" });
            }
        }

        private async Task<Tuple<string,string,string>> GetInstrumentationKey()
        {
            Tuple<string, string, string> data = null;
            SecretClientOptions options = new SecretClientOptions()
            {
                Retry =
                {
                    Delay= TimeSpan.FromSeconds(2),
                    MaxDelay = TimeSpan.FromSeconds(16),
                    MaxRetries = 5,
                    Mode = RetryMode.Exponential
                 }
            };

            var client = new SecretClient(new Uri("https://reactapp.vault.azure.net/"), new DefaultAzureCredential(), options);

            KeyVaultSecret secret_connectionstring = client.GetSecret("reactappstorage");
            KeyVaultSecret secret_storagekey = client.GetSecret("reactappstoragekey1");
            KeyVaultSecret secret_storagename = client.GetSecret("reactappstoragename");

            data = new Tuple<string, string, string>(secret_connectionstring.Value, secret_storagekey.Value, secret_storagename.Value);

            return await Task.FromResult(data);
        }
    }
}
