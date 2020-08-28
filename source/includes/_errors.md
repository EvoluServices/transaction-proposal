# Erros Gerais

Códigos retornados em caso de erro, identificando o motivo do erro e suas respectivas mensagens.



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
|`MERCHANT_NOT_FOUND`|Estabelecimento não encontrado.|

<aside class="notice">Verifique se o ID do estabelecimento está correto. Se o problema persistir, entre em contato com o suporte.</aside>
