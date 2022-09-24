using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Best_UI_React_App.Migrations
{
    public partial class MakingEmailColumnUnique : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
               name: "IsUserActive",
               table: "AspNetUsers",
               type: "bit",
               nullable: false,
               defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsUserActive",
                table: "AspNetUsers");
        }
    }
}
