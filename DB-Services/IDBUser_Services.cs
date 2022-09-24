using Best_UI_React_App.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Best_UI_React_App.DB_Services
{
    public interface IDBUser_Services
    {
        internal string CallingUserImgSrc(UserUIModel userDetails);

        internal bool DeleteUser(string deleteRecordId, out string errorResult);

        internal Tuple<UserUIModel, int> CallingUserDetails(string email);       
    }
}
