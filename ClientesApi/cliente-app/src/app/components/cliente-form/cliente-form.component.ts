import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente, Telefone } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  template: `
    <h2>{{ isEditMode ? 'Editar' : 'Criar' }} Cliente</h2>
    <form [formGroup]="clienteForm" (ngSubmit)="onSubmit()">
      <div>
        <label for="nome">Nome:</label>
        <input id="nome" formControlName="nome" required>
      </div>
      <div>
        <label for="cpf">CPF:</label>
        <input id="cpf" formControlName="cpf" required>
      </div>
      <div>
        <label for="email">Email:</label>
        <input id="email" formControlName="email" required>
      </div>
      <div formArrayName="telefones">
        <h3>Telefones</h3>
        <button type="button" (click)="addTelefone()">Adicionar Telefone</button>
        <div *ngFor="let telefone of telefonesFormArray.controls; let i = index">
          <label>
            Telefone {{i + 1}}:
            <input [formControlName]="i">
          </label>
          <button type="button" (click)="removeTelefone(i)">Remover</button>
        </div>
      </div>
      <button type="submit" [disabled]="!clienteForm.valid">Salvar</button>
    </form>
  `
})
export class ClienteFormComponent implements OnInit {
  clienteForm: FormGroup;
  isEditMode = false;
  clienteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clienteForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      telefones: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clienteId = +params['id'];
        this.loadCliente(this.clienteId);
      }
    });
  }

  get telefonesFormArray() {
    return this.clienteForm.get('telefones') as FormArray;
  }

  loadCliente(id: number): void {
    this.clienteService.getCliente(id).subscribe(
      (cliente: Cliente) => {
        this.clienteForm.patchValue(cliente);
        cliente.telefones.forEach(telefone => {
          this.telefonesFormArray.push(this.fb.control(telefone.numero));
        });
      },
      error => console.error('Erro ao carregar cliente', error)
    );
  }

  addTelefone(): void {
    this.telefonesFormArray.push(this.fb.control(''));
  }

  removeTelefone(index: number): void {
    this.telefonesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const cliente: Cliente = {
        ...this.clienteForm.value,
        telefones: this.clienteForm.value.telefones.map((numero: string) => ({ numero }))
      };

      if (this.isEditMode) {
        cliente.id = this.clienteId!;
        this.clienteService.updateCliente(cliente).subscribe(
          () => this.router.navigate(['/clientes']),
          error => console.error('Erro ao atualizar cliente', error)
        );
      } else {
        this.clienteService.createCliente(cliente).subscribe(
          () => this.router.navigate(['/clientes']),
          error => console.error('Erro ao criar cliente', error)
        );
      }
    }
  }
}