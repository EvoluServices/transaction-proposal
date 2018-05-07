import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    value: '',
    clientName: '',
  };

  startTransaction = async () => {
    // recuperamos através do estado da página os campos que serão enviados na transação
    const { value, paymentBrand, installments, clientName } = this.state;
    // validamos o campo valor, que é obrigatório
    if (!value) {
      this.setState({valueError: 'O campo valor é obrigatório'});
      return;
    } else {
      this.setState({valueError: ''});
    }

    this.setState({loading: true});
    // fazemos a requisição para nosso servidor usando a api fetch do browser
    // (https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API/Using_Fetch)
    // montando o body da requisição de acordo com a documentação da Evoluservices
    // (https://evoluservices.github.io/transaction-proposal/#cria-transa-o-remota)
    const response = await fetch('/transaction', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        transaction: {
          value: parseFloat(value, 10).toFixed(2),
          installments,
          clientName,
          paymentBrand,
        }
      })
    });
    const transactionResponse = await response.json();
    console.log(transactionResponse);
    
    this.setState({
      loading: false,
      response: {
        success: transactionResponse.success,
        error: transactionResponse.error,
      }
    });
  }

  renderFeedback() {
    return (this.state.response.success === "true"
      ? <span className="Success">Sucesso! Aguarde a notificação</span>
      : <span className="Failure">Erro: {this.state.response.error}</span>)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Integração transação Evoluservices</h1>
          <span className="App-subtitle">Exemplo de uma aplicação web que se integra com o app de transações Evoluservices</span>
        </header>
        <div className="Transaction-form">
        <h4>Dados da transação</h4>
          <div className="Transaction-form-field-wrapper">
            <label>Valor*: </label>
            <input 
              type="number" 
              className="Field"
              placeholder="Valor"
              value={this.state.value}
              onChange={event => this.setState({value: event.target.value})}
            />
          </div>
          {this.state.valueError
            ? <div className="Hint" style={{color: 'red'}}>O campo valor é obrigatório</div>
            : null
          }
          <div className="Transaction-form-field-wrapper">
            <label>Bandeira: </label>
            <select 
              className="Field"
              value={this.state.paymentBrand}
              onChange={event => this.setState({paymentBrand: event.target.value})}
            >
              <option value="">-</option>
              <option value="VISA_CREDITO">Visa</option>
              <option value="VISA_ELECTRON">Visa Electron</option>
              <option value="MASTERCARD">Mastercard</option>
              <option value="MAESTRO">Mastercard Maestro</option>
              <option value="AMEX">American Express</option>
              <option value="DINERS">Diners</option>
              <option value="HIPERCARD">Hipercard</option>
              <option value="AURA">Aura</option>
              <option value="SOROCRED">Sorocred</option>
              <option value="ELO">Elo</option>
              <option value="ELO_DEBITO">Elo Débito</option>
              <option value="SICREDI">Sicredi</option>
              <option value="HIPER">Hiper</option>
              <option value="AGIPLAN">Agiplan</option>
              <option value="BANESCARD">Banescard</option>
              <option value="CREDZ">CredZ</option>
              <option value="JCB">JCB</option>
              <option value="CABAL">Cabal</option>
              <option value="MAIS">Mais</option>
            </select>
          </div>
          <div className="Transaction-form-field-wrapper">
            <label>Qtde de parcelas: </label>
            <select
              className="Field"
              value={this.state.installments}
              onChange={event => this.setState({installments: event.target.value})}
            >
              <option value="">-</option>
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="3">3x</option>
              <option value="4">4x</option>
              <option value="5">5x</option>
              <option value="6">6x</option>
              <option value="7">7x</option>
              <option value="8">8x</option>
              <option value="9">9x</option>
              <option value="10">10x</option>
              <option value="11">11x</option>
              <option value="12">12x</option>
            </select>
          </div>
          <div className="Transaction-form-field-wrapper">
            <label>Cliente: </label>
            <input 
              type="text" 
              className="Field"
              placeholder="Nome do cliente"
              value={this.state.clientName}
              onChange={event => this.setState({clientName: event.target.value})}
            />
          </div>
          <div className="Hint">(*) Campos obrigatórios</div>
          <div style={{marginTop: 10}}>
            <button disabled={this.state.loading} onClick={this.startTransaction}>Iniciar transação</button>
            <div className="Request-feedback">
            {
              this.state.loading
              ? 'Carregando...'
              : this.state.response ? this.renderFeedback() : null
            }
            </div>
            <div className="Hint">
              Ao clicar em "Iniciar transação", o app da Evoluservices enviará uma notificação
              (e isso pode demorar alguns segundos)
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
