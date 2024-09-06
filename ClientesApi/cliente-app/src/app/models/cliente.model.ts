export interface Cliente {
    id?: number;
    nome: string;
    cpf: string;
    email: string;
    telefones: Telefone[];
  }
  
  export interface Telefone {
    id?: number;
    numero: string;
  }