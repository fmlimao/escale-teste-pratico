describe('Teste de condição if', () => {
  it('deve executar o bloco quando a condição é verdadeira', () => {
    // Mock da função a ser chamada
    const mockFunction = jest.fn();

    // Executa a condição
    const condition = true;
    if (condition) {
      mockFunction();
    }

    // Verifica se a função foi chamada
    expect(mockFunction).toHaveBeenCalled();
  });
});
