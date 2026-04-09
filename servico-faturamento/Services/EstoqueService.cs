using System.Text;
using System.Text.Json;

namespace servico_faturamento.Services;

public class EstoqueService
{
    private readonly HttpClient _httpClient;

    public EstoqueService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool> BaixarSaldo(int produtoId, int quantidade)
    {
        var body = JsonSerializer.Serialize(new { quantidade });
        var content = new StringContent(body, Encoding.UTF8, "application/json");

        var response = await _httpClient.PatchAsync(
            $"api/produtos/{produtoId}/saldo", content);

        return response.IsSuccessStatusCode;
    }
}