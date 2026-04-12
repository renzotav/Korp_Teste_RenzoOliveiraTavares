namespace servico_faturamento.Models;

public class IdempotencyToken
{
    public string Token { get; set; } = string.Empty;
    public int NotaFiscalId { get; set; }
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
}