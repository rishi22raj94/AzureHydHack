using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Best_UI_React_App.Migrations
{
    public partial class Deleting_IsUserActive_ForAzure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsUserActive",
                table: "AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsUserActive",
                table: "AspNetUsers");
        }
    }
}
