namespace servico_estoque.Models;

public class Produto
{
    
public int Id { get; set;}
public String Codigo { get; set;} = string.Empty;
public String Descricao {get; set;} = string.Empty;
public int Saldo {get; set;}
public DateTime CriadoEm {get; set;} = DateTime.UtcNow;
public uint RowVersion { get; set; }
    
}