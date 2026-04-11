namespace servico_faturamento.Services;

public class EstoqueIndisponivelException : Exception
{
    public EstoqueIndisponivelException(string mensagem) : base(mensagem){}
}