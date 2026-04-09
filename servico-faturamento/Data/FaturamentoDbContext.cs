using Microsoft.EntityFrameworkCore;
using servico_faturamento.Models;

namespace servico_faturamento.Data;

public class FaturamentoDbContext : DbContext
{
    public FaturamentoDbContext(DbContextOptions<FaturamentoDbContext> options)
        : base(options) { }

    public DbSet<NotaFiscal> NotasFiscais { get; set; }
    public DbSet<ItemNota> ItensNota { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NotaFiscal>(entity =>
        {
            entity.HasKey(n => n.Id);
            entity.HasIndex(n => n.Numero).IsUnique();
            entity.Property(n => n.Status).IsRequired().HasMaxLength(10);
            entity.HasMany(n => n.Itens)
                  .WithOne(i => i.NotaFiscal)
                  .HasForeignKey(i => i.NotaFiscalId);
        });

        modelBuilder.Entity<ItemNota>(entity =>
        {
            entity.HasKey(i => i.Id);
            entity.Property(i => i.Quantidade).IsRequired();
        });
    }
}