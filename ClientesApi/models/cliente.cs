using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ClienteAPI.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public required string Nome { get; set; }

        [Required]
        [StringLength(11)]
        public required string CPF { get; set; }

        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        public List<Telefone> Telefones { get; set; } = new List<Telefone>();
    }
 public class Telefone
    {
        public int Id { get; set; }
        public required string Numero { get; set; }
        public int ClienteId { get; set; }
        public required Cliente Cliente { get; set; }
    }

}