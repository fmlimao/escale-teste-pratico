const api = {
  host: '/api/pokemons',

  getAll() {
    return fetch(this.host)
      .then(res => res.json())
      .then(res => res.pokemons);
  },

  create(name: string) {
    return fetch(this.host, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    }).then(res => res.json());
  },

  getOne(id: string) {
    return fetch(`${this.host}/${id}`).then(res => res.json());
  },

  update(id: string, name: string) {
    return fetch(`${this.host}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    }).then(res => res.json());
  },

  delete(id: string) {
    return fetch(`${this.host}/${id}`, {
      method: 'DELETE'
    }).then(res => res.json());
  }
};

export default api;
