using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using servico_estoque.Data;
using servico_estoque.Models;

namespace servico_estoque.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly EstoqueDbContext _context;

    public ProdutosController(EstoqueDbContext context)
    {
        _context = context;
    }

    // GET: api/produtos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Produto>>> GetProdutos()
    {
        return await _context.Produtos.ToListAsync();
    }

    // GET: api/produtos/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Produto>> GetProduto(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);

        if (produto == null)
            return NotFound(new { mensagem = "Produto não encontrado." });

        return produto;
    }

    // POST: api/produtos
    [HttpPost]
    public async Task<ActionResult<Produto>> CriarProduto(Produto produto)
    {
        var existe = await _context.Produtos
            .AnyAsync(p => p.Codigo == produto.Codigo);

        if (existe)
            return BadRequest(new { mensagem = "Já existe um produto com esse código." });

        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, produto);
    }

    // PUT: api/produtos/5
    [HttpPut("{id}")]
    public async Task<IActionResult> AtualizarProduto(int id, Produto produto)
    {
        if (id != produto.Id)
            return BadRequest(new { mensagem = "ID da URL não confere com o ID do produto." });

        _context.Entry(produto).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _context.Produtos.AnyAsync(p => p.Id == id))
                return NotFound(new { mensagem = "Produto não encontrado." });

            throw;
        }

        return NoContent();
    }

    // DELETE: api/produtos/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletarProduto(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);

        if (produto == null)
            return NotFound(new { mensagem = "Produto não encontrado." });

        _context.Produtos.Remove(produto);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PATCH: api/produtos/5/saldo
    // Endpoint especial usado pelo serviço de faturamento para baixar saldo
    [HttpPatch("{id}/saldo")]
    public async Task<IActionResult> AtualizarSaldo(int id, [FromBody] AtualizarSaldoRequest request)
    {
        var produto = await _context.Produtos.FindAsync(id);

        if (produto == null)
            return NotFound(new { mensagem = "Produto não encontrado." });

        if (produto.Saldo < request.Quantidade)
            return BadRequest(new { mensagem = $"Saldo insuficiente. Saldo atual: {produto.Saldo}" });

        produto.Saldo -= request.Quantidade;
        await _context.SaveChangesAsync();

        return Ok(produto);
    }
}

public record AtualizarSaldoRequest(int Quantidade);