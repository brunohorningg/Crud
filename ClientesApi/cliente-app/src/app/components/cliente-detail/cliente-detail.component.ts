import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-detail',
  template: `
    <div *ngIf="cliente">
      <h2>Detalhes do Cliente</h2>
      <p><strong>Nome:</strong> {{ cliente.nome }}</p>
      <p><strong>CPF:</strong> {{ cliente.cpf }}</p>
      <p><strong>Email:</strong> {{ cliente.email }}</p>
      <h3>Telefones:</h3>
      <ul>
        <li *ngFor="let telefone of cliente.telefones">
          {{ telefone.numero }}
        </li>
      </ul>
      <button (click)="editCliente()">Editar</button>
      <button (click)="deleteCliente()">Excluir</button>
      <button (click)="goBack()">Voltar</button>
    </div>
  `
})
export class ClienteDetailComponent implements OnInit {
  cliente: Cliente | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCliente(+id);
    }
  }

  loadCliente(id: number): void {
    this.clienteService.getCliente(id).subscribe(
      (cliente: Cliente) => this.cliente = cliente,
      error => console.error('Erro ao carregar cliente', error)
    );
  }

  editCliente(): void {
    if (this.cliente) {
      this.router.navigate(['/clientes', this.cliente.id, 'edit']);
    }
  }

  deleteCliente(): void {
    if (this.cliente && confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCliente(this.cliente.id!).subscribe(
        () => this.router.navigate(['/clientes']),
        error => console.error('Erro ao excluir cliente', error)
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/clientes']);
  }
}