import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { NotaFiscalService } from '../../core/services/nota-fiscal.service';
import { ProdutoService } from '../../core/services/produto.service';
import { NotaFiscal } from '../../core/models/nota-fiscal.model';
import { Produto } from '../../core/models/produto.model';

@Component({
  selector: 'app-notas-fiscais',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './notas-fiscais.component.html'
})
export class NotasFiscaisComponent implements OnInit {
  notas: NotaFiscal[] = [];
  produtos: Produto[] = [];
  colunas = ['numero', 'status', 'itens', 'acoes'];
  form: FormGroup;
  carregando = false;
  imprimindo: number | null = null;

  constructor(
    private notaService: NotaFiscalService,
    private produtoService: ProdutoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      itens: this.fb.array([this.criarItemForm()])
    });
  }

  ngOnInit(): void {
    this.carregarNotas();
    this.carregarProdutos();
  }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  criarItemForm(): FormGroup {
    return this.fb.group({
      produtoId: [null, Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });
  }

  adicionarItem(): void {
    this.itens.push(this.criarItemForm());
  }

  removerItem(index: number): void {
    if (this.itens.length > 1) {
      this.itens.removeAt(index);
    }
  }

  carregarNotas(): void {
    this.carregando = true;
    this.notaService.listar().subscribe({
      next: (dados) => {
        this.notas = dados;
        this.carregando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar notas', 'Fechar', { duration: 3000 });
        this.carregando = false;
      }
    });
  }

  carregarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => this.produtos = dados
    });
  }

  nomeProduto(id: number): string {
    return this.produtos.find(p => p.id === id)?.descricao ?? `Produto ${id}`;
  }

  criarNota(): void {
    if (this.form.invalid) return;

    const nota: NotaFiscal = { itens: this.form.value.itens };

    this.notaService.criar(nota).subscribe({
      next: () => {
        this.snackBar.open('Nota criada!', 'Fechar', { duration: 3000 });
        this.form.reset();
        this.itens.clear();
        this.itens.push(this.criarItemForm());
        this.carregarNotas();
      },
      error: () => {
        this.snackBar.open('Erro ao criar nota', 'Fechar', { duration: 3000 });
      }
    });
  }

  imprimir(id: number): void {
  this.imprimindo = id;
  this.notaService.imprimir(id).subscribe({
    next: () => {
      this.snackBar.open('Nota impressa e fechada!', 'Fechar', { duration: 3000 });
      this.imprimindo = null;
      this.carregarNotas();
    },
    error: (err) => {
      this.imprimindo = null;

      if (err.status === 503) {
        this.snackBar.open(
          err.error?.mensagem ?? 'Serviço de estoque indisponível',
          'Fechar',
          { duration: 0, panelClass: ['snack-erro'] }
        );
      } else {
        this.snackBar.open(
          err.error?.mensagem ?? 'Erro ao imprimir nota',
          'Fechar',
          { duration: 4000, panelClass: ['snack-aviso'] }
        );
      }
    }
  });
}

  deletar(id: number): void {
    this.notaService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Nota removida!', 'Fechar', { duration: 3000 });
        this.carregarNotas();
      },
      error: (err) => {
        const mensagem = err.error?.mensagem ?? 'Erro ao remover nota';
        this.snackBar.open(mensagem, 'Fechar', { duration: 3000 });
      }
    });
  }
}