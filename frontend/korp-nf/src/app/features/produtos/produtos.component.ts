import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProdutoService } from '../../core/services/produto.service';
import { Produto } from '../../core/models/produto.model';

@Component({
  selector: 'app-produtos',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './produtos.component.html'
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  colunas = ['codigo', 'descricao', 'saldo', 'acoes'];
  form: FormGroup;
  editando: Produto | null = null;
  carregando = false;

  constructor(
    private produtoService: ProdutoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      saldo: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.produtoService.listar().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.carregando = false;
      },
      error: () => {
        this.snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    const produto = this.form.value;

    if (this.editando) {
      const atualizado = { ...this.editando, ...produto };
      this.produtoService.atualizar(this.editando.id!, atualizado).subscribe({
        next: () => {
          this.snackBar.open('Produto atualizado!', 'Fechar', { duration: 3000 });
          this.cancelarEdicao();
          this.carregarProdutos();
        },
        error: () => {
          this.snackBar.open('Erro ao atualizar produto', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.produtoService.criar(produto).subscribe({
        next: () => {
          this.snackBar.open('Produto criado!', 'Fechar', { duration: 3000 });
          this.form.reset({ saldo: 0 });
          this.carregarProdutos();
        },
        error: (err) => {
          const mensagem = err.error?.mensagem ?? 'Erro ao criar produto';
          this.snackBar.open(mensagem, 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  editar(produto: Produto): void {
    this.editando = produto;
    this.form.patchValue(produto);
  }

  cancelarEdicao(): void {
    this.editando = null;
    this.form.reset({ saldo: 0 });
  }

  deletar(id: number): void {
    this.produtoService.deletar(id).subscribe({
      next: () => {
        this.snackBar.open('Produto removido!', 'Fechar', { duration: 3000 });
        this.carregarProdutos();
      },
      error: () => {
        this.snackBar.open('Erro ao remover produto', 'Fechar', { duration: 3000 });
      }
    });
  }
}