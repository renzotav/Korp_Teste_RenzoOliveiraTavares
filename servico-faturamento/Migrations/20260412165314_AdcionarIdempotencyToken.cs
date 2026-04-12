using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace servico_faturamento.Migrations
{
    /// <inheritdoc />
    public partial class AdcionarIdempotencyToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IdempotencyTokens",
                columns: table => new
                {
                    Token = table.Column<string>(type: "text", nullable: false),
                    NotaFiscalId = table.Column<int>(type: "integer", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IdempotencyTokens", x => x.Token);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IdempotencyTokens");
        }
    }
}
