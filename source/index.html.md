---
title: Transação Remota

language_tabs:
  - json

toc_footers:
  - Nossos produtos
  - <a href='https://www.evcash.com.br/'>EvCash</a>
  - <a href='https://www.saudeservice.com.br/'>SaudeService</a>

includes:
  - value_table
  - errors

search: true
---

# Transação Remota

## Introdução

O objetivo desta documentação é orientar o desenvolvedor sobre como integrar com a solução EvCash/SaúdeService de transações Pinpad, descrevendo as funcionalidades, os métodos a serem utilizados, listando informações a serem enviadas e recebidas, e provendo exemplos.

Para realizar a transmissão, a EvoluServices utiliza os modelos de integração HTTPS/POST com reposta no formato JSON. 

Por fim, após o término do desenvolvimento, é preciso dar início à homologação junto à EvoluServices para iniciar a operação no ambiente de produção.

## Visão Geral

Neste manual será apresentado uma visão geral da integração entre sistemas de gestão e o produto PinPad da EvoluServices que permite que o primeiro execute transações de cartão de crédito através do nosso sistema. 

Cada transação é reconhecida como orçamento e a meta é efetivar uma venda associada a um tratamento e manter os dados consistentes entre a EvoluServices e seus parceiros.

Para isso detalharemos no decorrer do manual a visão do fluxo de dados do processo de autenticação, registro de uma transação e retorno dos dados, como resumido a seguir.

* **Autenticação do usuário – Método “/remote/token” [POST]** - Nessa fase inicial, o usuário se autentica na EvoluServices e recebe um token que ele deve utilizar nos registros de suas transações. O próximo passo só deve ser realizado caso esse primeiro tenha sucesso.
* **Registro de uma transação – Método “/remote/transaction” [POST]** - Nessa fase o sistema deve instanciar uma transação referente a um orçamento a ser cobrado, detalhando o modo que a transação será executada e informando aonde o retorno deve ser entregue.
* **Retorno dos dados – Callback** - Como contiunação do segundo passo a EvoluServices informa ao endereço informado os dados da transação em caso de aprovação ou dados de reprovação caso o processamento não tenha sucesso.


## Suporte EvoluServices

Caso persistam dúvidas relacionadas a implementação de ordem técnica ou não, a EvoluServices disponibiliza um time pronto para dar suporte nos seguintes contatos:

* +55 3014-8600 – *Capitais e Regiões Metropolitanas*
* +55 0800-940-4248 – *Demais Localidades*
* Email: [desenvolvimento@evoluservices.com](mailto:desenvolvimento@evoluservices.com)

# Autenticação

## Solicitando autorização

Para criar uma transação que utilizará cartão de crédito, é necessário enviar uma requisição utilizando o método `POST` para solicitar um token de acesso que deve ser utilizado nos headers das proóximas requisições, conforme o exemplo. 

### Requisição

```
{
 "auth": {
   "username": "teste",
   "apiKey": "123mudar"
 }
}
```

|Propriedade|Tipo|Obrigatório|Descrição|
|-----------|----|-----------|---------|
|`username`|Texto|Sim|Identificador da clínica ou profissional.|
|`apiKey`|Texto|Sim|Chave para Autenticação de uso exclusivo do clínica ou profissional.|


### Resposta

```
{
    "Bearer": "token"
}
```

|Propriedade|Tipo|Obrigatório|Descrição|
|-----------|----|-----------|---------|
|`Bearer`|Texto|Sim|Token a ser utilizado no header de criação das transações.|


<aside class="notice">Veja a seção <a href="#erros">Erros</a> para as respostas de requisições com erros.</aside>

# Iniciar Transação

### Iniciando uma transação

Para criar uma transação que utilizará cartão de crédito, é necessário enviar uma requisição utilizando o método *POST* utilizando no header o token informado além dos dados de uma transação para registro na EvoluServices, conforme o exemplo.

### Requisição

#### Headers

<aside class="notice">
  A requisição precisa incluir um **token de autenticação válido** no header.
</aside>

> ```Bearer TOKEN```

#### Body

```
{
  "transaction": { 
    "merchantId": "<id>",
    "terminalId": "<id>",
    "value": "<value>",
    "installments": "<installments>",
    "callback": "<url>"
  }
}
```


|Propriedade|Tipo|Obrigatório|Descrição|
|-----------|----|-----------|---------|
|`merchantId`|Texto|Sim|Identificador da clínica ou profissional.|
|`terminalId`|Texto|Sim|Terminal da clínica a receber a transação para aprovação.|
|`value`|Número|Sim|Valor do orçamento (ser enviado em centavos).|
|`installments`|Número|Não|Número de parcelas|
|`paymentBrand`|Texto|Não|Bandeira do cartão (para lista consulte [tabela de valores](#tabela-de-valores)).|
|`callback`|Texto|Não|URL de retorno com os dados da transação após processamento.|


### Resposta

**Em caso de sucesso**, retorna Status 200.

<aside class="notice">Veja a seção <a href="#erros">Erros</a> para as respostas de requisições com erros.</aside>

# Callback

Se uma URL for enviada quando a transação for criada, um json será enviado via POST quando o status da transação for alterado.

```json
{ 
    "remoteTransactionId": "<id>",
    "status": "<status>",
    "terminalId": "<id>",
    "merchantId": "<id>",
    "value": "<value>",
    "installments": "<installments>",
    "paymentBrand": "<id>"
}
```

|Propriedade|Tipo|Descrição|
|-----------|----|---------|
|`remoteTransactionId`|Texto|Identificador da transação.|
|`status`|Texto|Status da transação (consulte [a tabela de valores de status](#tabela-de-valores)).|
|`terminalId`|Número|Identificador do terminal de processamento da transação.|
|`merchantId`|Número|Identificador do estabelecimento.|
|`value`|Número|Bandeira do cartão (para lista consulte [tabela de valores](#tabela-de-valores)).|
|`installments`|Número|Quantidade de parcelas da transação processada.|
|`paymentBrand`|Texto|Bandeira do cartão (para lista consulte [tabela de valores](#tabela-de-valores)).|


<aside class="notice">Veja a seção <a href="#tabela-de-valores">Tabela de Valores</a> para os possíveis status da transação.</aside>


