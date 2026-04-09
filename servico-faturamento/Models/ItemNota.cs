using System.Text.Json.Serialization;

namespace servico_faturamento.Models;

public class ItemNota
{
    public int Id { get; set; }
    public int NotaFiscalId { get; set; }
    [JsonIgnore]
    public NotaFiscal? NotaFiscal { get; set; }
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
}