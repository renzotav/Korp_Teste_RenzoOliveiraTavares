using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using servico_faturamento.Data;
using servico_faturamento.Models;
using servico_faturamento.Services;

namespace servico_faturamento.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotasFiscaisController : ControllerBase
{
    private readonly FaturamentoDbContext _context;
    private readonly EstoqueService _estoqueService;

    public NotasFiscaisController(FaturamentoDbContext context, EstoqueService estoqueService)
    {
        _context = context;
        _estoqueService = estoqueService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<NotaFiscal>>> GetNotas()
    {
        return await _context.NotasFiscais
            .Include(n => n.Itens)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<NotaFiscal>> GetNota(int id)
    {
        var nota = await _context.NotasFiscais
            .Include(n => n.Itens)
            .FirstOrDefaultAsync(n => n.Id == id);

        if (nota == null)
            return NotFound(new { mensagem = "Nota fiscal não encontrada." });

        return nota;
    }

    [HttpPost]
    public async Task<ActionResult<NotaFiscal>> CriarNota(NotaFiscal nota)
    {
        var proximoNumero = await _context.NotasFiscais
            .MaxAsync(n => (int?)n.Numero) ?? 0;

        nota.Numero = proximoNumero + 1;
        nota.Status = "Aberta";

        _context.NotasFiscais.Add(nota);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetNota), new { id = nota.Id }, nota);
    }

    [HttpPost("{id}/imprimir")]
public async Task<IActionResult> Imprimir(int id)
{
    var nota = await _context.NotasFiscais
        .Include(n => n.Itens)
        .FirstOrDefaultAsync(n => n.Id == id);

    if (nota == null)
        return NotFound(new { mensagem = "Nota fiscal não encontrada." });

    if (nota.Status != "Aberta")
        return BadRequest(new { mensagem = "Apenas notas com status Aberta podem ser impressas." });

    try
    {
        foreach (var item in nota.Itens)
            await _estoqueService.BaixarSaldo(item.ProdutoId, item.Quantidade);

        nota.Status = "Fechada";
        await _context.SaveChangesAsync();

        return Ok(nota);
    }
    catch (EstoqueIndisponivelException ex)
    {
        return StatusCode(503, new { mensagem = ex.Message });
    }
    catch (Exception ex)
    {
        return BadRequest(new { mensagem = ex.Message });
    }
}

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletarNota(int id)
    {
        var nota = await _context.NotasFiscais.FindAsync(id);

        if (nota == null)
            return NotFound(new { mensagem = "Nota fiscal não encontrada." });

        if (nota.Status == "Fechada")
            return BadRequest(new { mensagem = "Não é possível excluir uma nota fechada." });

        _context.NotasFiscais.Remove(nota);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}