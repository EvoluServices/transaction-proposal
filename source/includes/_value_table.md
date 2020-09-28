# Tabela de valores

## Status da transação

|Status da Transação|Motivo|
|-------------------|-------------------|
|`APPROVED`|Transação aprovada com sucesso|
|`CANCELLED`|Transação cancelada pelo estabelecimento|
|`ABORTED`|Transação abortada devido a erros durante o processamento|
|`ABORTED_BY_MERCHANT`|Transação abortada pelo estabelecimento|
|`PARTIALLY_CANCELLED`|Transação parcialmente cancelada|

<aside class="notice">
Além dos valores acima, também possuímos alguns status para controle interno tais como: COMPLETE, INCOMPLETE, CANCEL_REQUESTED, entre outros mas não devem ser considerados na modelagem pois podem ser alterados a qualquer instante
</aside>


## Status da parcela

|Status da Transação|Motivo|
|-------------------|-------------------|
|`PAYED`|Parcela paga|
|`UNPAID`|Parcela a pagar|
|`ANTICIPATION_REQUESTED`|Antecipação da parcela solicitada|
|`ANTICIPATED`|Antecipação da parcela paga|
|`CANCEL_REQUESTED`|Cancelamento da parcela solicitado|
|`CANCELLED`|Parcela cancelada|

## Status do terminal

|<div style="width:120px">Status do Terminal</div>|Motivo|
|-------------------|-------------------|
|`ONLINE`|Terminal pronto para receber transações.|
|`ONLINE_DIFFERENT_ACCOUNT`|Terminal está sendo utilizado por outro estabelecimento. Se o terminal está na versão 4.14 ou superior, está apto a receber transações.|
|`OFFLINE`|Terminal desligado. Transações não serão processadas até que o terminal fique ONLINE (ou ONLINE_DIFFERENT_ACCOUNT para versões superiores a v4.14).|
|`UNKNOWN`|Terminal em estado desconhecido (retornado para os terminais com versões anteriores a v4.0).|

## Bandeira

|String da Bandeira|Nome da bandeira|
|-------------------|-------------------|
|`VISA_CREDITO`|Visa|
|`VISA_ELECTRON`|Visa Electron (Débito)|
|`MASTERCARD`|MasterCard|
|`MAESTRO`|MasterCard Maestro (Débito)|
|`AMEX`|American Express|
|`DINERS`|Diners|
|`HIPERCARD`|Hipercard|
|`AURA`|Aura|
|`SOROCRED`|Sorocred|
|`ELO`|Elo|
|`SICREDI`|Sicred|
|`ELO_DEBITO`|Elo Débito|
|`HIPER`|Hiper|
|`AGIPLAN`|Agiplan|
|`BANESCARD`|Banescard|
|`CREDZ`|CredZ|
|`JCB`|JCB|
|`CABAL`|Cabal|
|`MAIS`|Mais|