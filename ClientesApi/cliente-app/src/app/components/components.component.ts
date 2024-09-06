import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../models/cliente.model';
import { ClienteService } from '../services/cliente.service';

@Component({
  selector: 'app-cliente-list',
  template: `
    <h2>Lista de Clientes</h2>
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let cliente of clientes">
          <td>{{ cliente.nome }}</td>
          <td>{{ cliente.email }}</td>
          <td>
            <button (click)="viewCliente(cliente.id)">Ver</button>
            <button (click)="editCliente(cliente.id)">Editar</button>
            <button (click)="deleteCliente(cliente.id)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>
    <button (click)="addCliente()">Adicionar Cliente</button>
  `
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadClientes();
  }

  loadClientes(): void {
    this.clienteService.getClientes().subscribe(
      (data: Cliente[]) => this.clientes = data,
      (error: any) => console.error('Erro ao carregar clientes', error)
    );
  }

  viewCliente(id: number): void {
    this.router.navigate(['/clientes', id]);
  }

  editCliente(id: number): void {
    this.router.navigate(['/clientes', id, 'edit']);
  }

  deleteCliente(id: number): void {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe(
        () => this.loadClientes(),
        (error: any) => console.error('Erro ao excluir cliente', error)
      );
    }
  }

  addCliente(): void {
    this.router.navigate(['/clientes/new']);
  }
}