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

#### Header

É necessário especificar no header o tipo de conteúdo enviado no body da requisição.

> ```Content-Type application/json```


#### Body

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

#### Header

É necessário especificar no header o tipo de conteúdo enviado no body da requisição.

> ```Content-Type application/json```

> ```Bearer TOKEN```

<aside class="warning">
  A requisição precisa incluir um <b>token de autenticação válido</b> no header.
</aside>

#### Body

```
{
  "transaction": { 
    "merchantId": "<id>",
    "terminalId": "<id>",
    "value": "10.00",
    "installments": "2",
    "callbackUrl": "<url>",
    "clientName": "<name>",
    "clientEmail": "<email>"
  }
}
```


|Propriedade|Tipo|Obrigatório|Descrição|
|-----------|----|-----------|---------|
|`merchantId`|Texto|Sim|Identificador da clínica ou profissional.|
|`terminalId`|Texto|Não|Terminal da clínica a receber a transação para aprovação.|
|`value`|Número|Sim|Valor do orçamento (em decimal).|
|`installments`|Número|Não|Número de parcelas|
|`paymentBrand`|Texto|Não|Bandeira do cartão (para lista consulte [tabela de valores](#tabela-de-valores)).|
|`callbackUrl`|Texto|Não|URL de retorno com os dados da transação após processamento. A URL deve ser https.|
|`clientName`|Texto|Não|Nome do cliente final ao qual a transação pertence. Apesar de não obrigatório, recomenda-se fortemente que esse campo se preenchido|
|`clientEmail`|Texto|Não|Email do cliente, para onde pode ser enviado o comprovante da venda, opcionalmente|

<aside class="warning">
  A URL de callback tem que ser https.
</aside>

### Resposta

**Em caso de sucesso**, retorna Status 200.

<aside class="notice">Veja a seção <a href="#erros">Erros</a> para as respostas de requisições com erros.</aside>

# Callback

Se uma URL for enviada quando a transação for criada, um json será enviado via POST quando o status da transação for alterado.

```json
{ 
    "remoteTransactionId": "<id>",
    "status": "APPROVED",
    "merchantId": "<id>",
    "value": "10.00",
    "paymentBrand": "VISA_CREDITO",
    "transactionNumber": "<transactionNumber>",
    "paymentQuantity": "2",
    "clientName": "CLIENT_NOT_INFORMED",
    "payments": [
       {
            "status": "UNPAID",
            "value": 4.95,
            "number": 1,
            "date": "21/12/2016"
        },
        {
            "status": "UNPAID",
            "value": 4.95,
            "number": 2,
            "date": "21/01/2017"
        }
     ]
}
```

|Propriedade|Tipo|Descrição|
|-----------|----|---------|
|`remoteTransactionId`|Texto|Identificador da transação.|
|`status`|Texto|Status da transação (consulte [a tabela de valores de status](#tabela-de-valores)).|
|`merchantId`|Número|Identificador do estabelecimento.|
|`value`|Número|Valor total da transação.|
|`paymentBrand`|Texto|Bandeira do cartão (para lista consulte [tabela de valores](#tabela-de-valores)).|
|`payments`|Lista de objetos|Parcelas da transação.|
|`paymentQuantity`|Número|Número de parcelas.|
|`clientName`|Texto|Nome do cliente que passou a transação, quando fornecido.|

### Parâmetros da parcela
|Propriedade|Tipo|Descrição|
|-----------|----|---------|
|`status`|Texto|Status da parcela.|
|`value`|Número|Valor da parcela, que será pago ao estabelecimento.|
|`number`|Número| Número da parcela.|
|`date`|Texto|Data estimada de pagamento da parcela.|

<aside class="notice">Veja a seção <a href="#tabela-de-valores">Tabela de Valores</a> para os possíveis status da transação e da parcela.</aside>


