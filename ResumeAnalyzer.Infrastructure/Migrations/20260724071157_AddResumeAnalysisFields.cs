using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResumeAnalyzer.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddResumeAnalysisFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MissingSkills",
                table: "Resumes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Skills",
                table: "Resumes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Suggestions",
                table: "Resumes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MissingSkills",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "Skills",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "Suggestions",
                table: "Resumes");
        }
    }
}
