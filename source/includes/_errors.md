# Erros

Códigos retornados em caso de erro, identificando o motivo do erro e suas respectivas mensagens.

## Autenticação

Os erros desse método são do tipo `HTTP 500`.

```Status: 500 ```

> ```Status: 500 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

|Mensagem|Descrição|
|-----------|---------|
|`USER_TOKEN_NOT_FOUND`|Verifique se o usuário está correto, ou entre em contato com o suporte para um novo usuário da API.|
|`PASSWORD_INVALID`|Verifique se a chave da API está correta ou peça uma nova.|

<aside class="notice">Veja a seção <a href="#autentica-o">Autenticação</a> para informações do fluxo de autenticação.</aside>
 
## Iniciar uma transação

Os erros desse método são do tipo `HTTP 401` e `HTTP 500`

```Status: 401 ```
> ```Status: 401 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

|Mensagem|Descrição|
|-----------|---------|
|`REVOKED_TOKEN`|O token foi revogado antes da data de expiração.|
|`INVALID_TOKEN`|O token informado não é igual ao cadastrado.|
|`EXPIRED_TOKEN`|O token não tem mais validade.|

<aside class="notice">Para qualquer um dos casos acima peça um novo token de <a href="#autentica-o">/token</a>.</aside>


```Status: 500 ```
> ```Status: 500 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

|Mensagem|Descrição|
|-----------|---------|
|`PAYMENT_BRAND_ID_INVALID`|A bandeira não existe.|
|`INSTALLMENTS_INVALID_FOR_DEBIT`|Cartão de débito não pode ter mais de uma parcela.|
|`INVALID_PAYMENT_BRAND`|A bandeira não está habilitada para o estabelecimento.|
|`INVALID_INSTALLMENTS_QUANTITY_OR_VALUE`|O número de parcelas ou valor minimo da parcela não é aceito pelo estabelecimento.|
|`MERCHANT_ID_INVALID`|Id do merchant não existe.|
|`TERMINAL_ID_INVALID`|Id do terminal não existe.|
|`MERCHANT_TERMINAL_INVALID`|Terminal do merchant não está apto a receber transações remotas|
|`VALUE_FIELD_INVALID`|Formato do campo `value` inválido|
|`NAME_CLIENT_INVALID`|Campo `clientName` inválido|

<aside class="notice">Veja a seção <a href="#cria-transa-o-remota">Iniciar Transação</a> para informações do fluxo de criação de transações.</aside>

## Remover uma transação

Os erros desse método são do tipo `HTTP 500`

```Status: 500 ```
> ```Status: 500 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

|Mensagem|Descrição|
|-----------|---------|
|`INEXISTENT_REMOTE_TRANSACTION`|Transação remota inexistente|
|`REMOTE_TRANSACTION_ALREADY_PROCESSED`|Já foi iniciado o processamento da transação remota|
|`ID_INVALID`|Id da transação inválido|

<aside class="notice">Veja a seção <a href="#exclui-transa-o-remota">Remover Transação</a> para informações do fluxo de remoção de transações.</aside>

## Listar terminais

Os erros desse método são do tipo `HTTP 401` e `HTTP 500`

```Status: 401 ```
> ```Status: 401 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

|Mensagem|Descrição|
|-----------|---------|
|`INVALID_TOKEN`|Token inválido.|

<aside class="notice">Para o erro acima peça um novo token de <a href="#autentica-o">/token</a>.</aside>


```Status: 500 ```
> ```Status: 500 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

|Mensagem|Descrição|
|-----------|---------|
|`MERCHANT_NOT_FOUND`|Estabelecimento não encontrado.|

<aside class="notice">Verifique se o ID do estabelecimento está correto. Se o problema persistir, entre em contato com o suporte.</aside>