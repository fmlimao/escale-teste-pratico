const api = {
  host: '/api/pokemons',

  async getAll() {
    try {
      const res = await fetch(this.host);
      const data = await res.json();
      
      if (!res.ok) {
        const errorMessage = data.error?.message || 'Erro ao buscar pokemons';
        throw new Error(errorMessage);
      }
      
      return data.pokemons;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro ao buscar pokemons');
      }
    }
  },

  async create(name: string) {
    try {
      const res = await fetch(this.host, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      const data = await res.json();
      
      if (!res.ok) {
        // Formato de erro da API: {"error":{"code":404,"message":"Pokémon X não encontrado na PokeAPI"}}
        const errorMessage = data.error?.message || 'Erro ao criar pokemon';
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Erro ao criar pokemon');
      }
    }
  },

  async getOne(id: string) {
    try {
      const res = await fetch(`${this.host}/${id}`);
      const data = await res.json();
      
      if (!res.ok) {
        const errorMessage = data.error?.message || `Erro ao buscar pokemon com id ${id}`;
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Erro ao buscar pokemon com id ${id}`);
      }
    }
  },

  async update(id: string, name: string) {
    try {
      const res = await fetch(`${this.host}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        const errorMessage = data.error?.message || `Erro ao atualizar pokemon com id ${id}`;
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Erro ao atualizar pokemon com id ${id}`);
      }
    }
  },

  async delete(id: string) {
    try {
      const res = await fetch(`${this.host}/${id}`, {
        method: 'DELETE'
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        const errorMessage = data.error?.message || `Erro ao excluir pokemon com id ${id}`;
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Erro ao excluir pokemon com id ${id}`);
      }
    }
  }
};

export default api;
