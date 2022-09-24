using Best_UI_React_App.Azure_Services;
using Best_UI_React_App.DB_Services;
using Best_UI_React_App.Mail_Services;
using Best_UI_React_App.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;

namespace Best_UI_React_App
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            services.AddMvc();
            services.AddScoped<IAzureUploadServices, AzureUploadServices>();
            services.AddScoped<IDBUser_Services, DBUser_Services>();
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            services.AddTransient<IMailService, MailService>();

            services.AddDbContext<UserDBContext>(options => options.UseSqlServer(Configuration.GetConnectionString("AuthConnectionStringProd")));

            //if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production")
            //    services.AddDbContext<UserDBContext>(options => options.UseSqlServer(Configuration.GetConnectionString("AuthConnectionStringProd")));
            //else
            //    services.AddDbContext<UserDBContext>(options => options.UseSqlServer(Configuration.GetConnectionString("AuthConnectionStringLocal")));

            // Automatically perform database migration
            //services.BuildServiceProvider().GetService<UserDBContext>().Database.Migrate();           
            services.AddIdentity<User, IdentityRole>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+/ ";
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = true;
            }).AddEntityFrameworkStores<UserDBContext>()
            .AddDefaultTokenProviders();            

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }
        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }        
    }
}
