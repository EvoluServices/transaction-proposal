# Erros

## [Autenticação](/transaction-proposal/#autentica-o)
> ```Status: 500 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

* `USER_TOKEN_NOT_FOUND`: Verifique se o usuário está correto, ou entre em contato com o suporte para um novo usuário da API
* `PASSWORD_INVALID`: Verifique se a chave da API está correta ou peça uma nova.
 
## [Iniciar uma transação](/transaction-proposal/#iniciar-transa-o)

> ```Status: 401 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

Para qualquer um dos casos abaixo peça um novo token de [/token](/transaction-proposal/#autentica-o)

* `REVOKED_TOKEN`
* `INVALID_TOKEN`
* `EXPIRED_TOKEN`

> ```Status: 500 ```

```
{
   "success": "false",
   "error": "<Error message>"
}
```

* `PAYMENT_BRAND_ID_INVALID`: bandeira não existe
* `INSTALLMENTS_INVALID_FOR_DEBIT`: débito não pode ter mais de uma parcela
* `INVALID_PAYMENT_BRAND`: bandeira não é aceita pelo estabelecimento
* `INVALID_INSTALLMENTS_QUANTITY_OR_VALUE`: número de parcelas ou valor minimo da parcela não é aceito pelo estabelecimento
* `MERCHANT_ID_INVALID`: Id do merchant não existe
* `TERMINAL_ID_INVALID`: Id do terminal não existe

