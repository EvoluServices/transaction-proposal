---
title: Transação Remota

language_tabs:
  - json
  - java
  - csharp

toc_footers:
  - Nossos produtos
  - <a href='https://www.sejaevo.com.br/'>Evo</a>
  - <a href='https://www.saudeservice.com.br/'>SaudeService</a>

includes:
  - value_table
  - errors

search: true
---

# EvoluServices API

## Introdução

O objetivo desta documentação é orientar o desenvolvedor sobre como utilizar nossas APIs para integrar com a solução Evo/SaúdeService de transações Pinpad, descrevendo as funcionalidades, os métodos a serem utilizados, listando informações a serem enviadas e recebidas, e provendo exemplos.

As APIs estão organizadas em torno de um conjunto de endpoints acessíveis via HTTP que recebem e respondem JSON.

Antes do início da operação em ambiente de produção, é necessário passar pelo processo de homologação para que as implementações sejam certificadas junto à EvoluServices. Para maiores informações, por favor, entre em contato com a equipe de suporte.

## Suporte EvoluServices

Caso persistam dúvidas relacionadas a implementação de ordem técnica ou não, a EvoluServices disponibiliza um time pronto para dar suporte nos seguintes contatos:

* +55 3014-8600 – *Capitais e Regiões Metropolitanas*
* +55 0800-940-4248 – *Demais Localidades*
* Email: [desenvolvimento@evoluservices.com](mailto:desenvolvimento@evoluservices.com)

## Postman

Aqui está uma coleção de requisições de exemplo no [Postman](https://www.getpostman.com) para ajudar a se familiarizar mais rapidamente com a nossas APIs.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/b8c96dcf41ee61991f0f)

### Importante

Para usar a requisição de *Autenticação*, é preciso ter definido, dentro de algum [Environment](https://www.getpostman.com/docs/environments), as seguintes variáveis:

* `username`
* `apiKey`

Para usar as *demais requisições*, é preciso ter definido, dentro de algum [Environment](https://www.getpostman.com/docs/environments), as seguintes variáveis:

* `bearer`
* `merchantId`

## Histórico de revisões

### **v1.0.4**
* Adição dos exemplos das requisições em C#

### **v1.0.4**
* Adição de número de autorização na callback

### **v1.0.3**
* Adição do botão "Run in Postman" com uma coleção de requisições de exemplo

### **v1.0.2**
* Alteração na descrição do parâmetro `paymentBrand` para indicar sua obrigatoriedade caso o número de parcelas for informado
* Adição da coluna `validação` na lista de parâmetros ao [criar uma transação remota](#cria-transa-o-remota)

### **v1.0.1**
* Descrição do parâmetro TerminalId do método [RemoteTransaction #create](#cria-transa-o-remota)
* Adição do endpoint [Terminal #list](#terminais)

### **v1.0.0**
* Versão incial da documentação


# Autenticação


```csharp
private static String getToken()
	{
		var request = (HttpWebRequest)WebRequest.Create("https://sandbox.evoluservices.com/remote/token");
		request.Method = "POST";
		request.ContentType = "application/json";
		var requestStream = request.GetRequestStream();
		var auth = JsonConvert.SerializeObject(new { auth = new { username = "teste", apiKey = "123mudar"} });
		var buffer = Encoding.ASCII.GetBytes(auth);
		requestStream.Write(buffer, 0, buffer.Length);
		requestStream.Close();
		try
		{
			using (var response = (HttpWebResponse)request.GetResponse())
			{
				using (var responseStream = response.GetResponseStream())
				{
					using (var sr = new StreamReader(responseStream))
					{
						return JsonConvert.DeserializeObject<dynamic>(sr.ReadToEnd()).Bearer.Value;
					}
				}
			}
		}
		catch (WebException webException)
		{
			if(webException.Status == WebExceptionStatus.ProtocolError)
			{
				var response = webException.Response as HttpWebResponse;
				if(response == null)
				{
					Debug.WriteLine("Request error with http status:" + (int)response.StatusCode);
				}
			}
			throw webException;
		}
	}
```

Os endpoints das APIs são protegidos por um `Bearer` token que deve ser enviado no cabeçalho das requisições HTTP

Para obter um token de acesso é necessário apresentar as credenciais da sua aplicação ao método `POST /remote/token`. As credenciais de acesso (username e apiKey) podem ser obtidas entrando em contato com a equipe de suporte.

O token de acesso possui uma data de expiração, mas também pode ser revogado antes do tempo. Sua implementação deve, portanto, ser capaz de tratar a renovação do token e fazer uma nova tentativa caso o token apresentado esteja inválido.

### Requisição HTTP

`POST /remote/token`

### Header

É necessário especificar no header o tipo de conteúdo enviado no body da requisição.

`Content-Type`: `application/json`

> ```Content-Type application/json```


### Body

```json
{
 "auth": {
   "username": "teste",
   "apiKey": "123mudar"
 }
}
```

Encapsular as propriedades abaixo em um objeto "auth".

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

# Transação Remota

## Visão Geral

A API de transação remota permite que o processamento de transações de cartões de crédito e débito, através de dispositivos físicos (PinPad), seja disparadas por uma chamada HTTP. 

Cada transação remota é reconhecida como uma cobrança que deverá ser efetivada através de uma transação. Para realizar a conciliação das cobranças e manter os dados consistentes, ao criar uma nova transação remota, você pode registrar um endereço de retorno (através do parâmetro `callbackUrl`) que receberá notificações sobre mudanças de estado da transação.

A seguir, é possível ter uma visão geral das requisições que fazem parte dos processos de autenticação, registro de uma transação e retorno dos dados:

* **Autenticação: `[POST] /remote/token`**

Para acessar os endpoints da API é necessário apresentar o token da sua aplicação que pode ser obtido através deste método, mediante apresentação das credenciais de acesso fornecidas pelo suporte (username e apiKey)

* **Cria uma transação remota: `[POST] /remote/transaction`**

Cria uma nova transação referente a uma cobrança. Os parâmetros permitem detalhar o modo que a transação será executada e informar o endereço de retorno.

* **Retorno dos dados: Callback**

Durante todo o ciclo de vida da transação (criação, aprovação/cancelamento, pagamento, etc), os dados da transação referentes às mudanças de estado são enviadas ao endereço informado ao criar a cobrança.

## Cria Transação Remota

Para criar uma transação que utilizará cartão de crédito, é necessário enviar uma requisição utilizando o método `POST` utilizando no header o token informado além dos dados de uma transação para registro na EvoluServices, conforme o exemplo.

### Requisição HTTP
`POST /remote/transaction`

### Header

É necessário especificar no header o tipo de conteúdo enviado no body da requisição, junto com o Bearer.

|Parâmetro|Valor|
|---------|-----|
|`Content-Type`|`application/json`|
|`Bearer`|`TOKEN`|

> ```Content-Type application/json```

> ```Bearer TOKEN```

<aside class="warning">
  A requisição precisa incluir um <b>token de autenticação válido</b> no header.
</aside>

### Body

```java
 public static void main(String[] args) throws IOException {
		// JSON com as informações de inicio da transação remota
        String rawData = "{'transaction': { 'merchantId': 'ABC123','value': '10.00','installments': '2','paymentBrand': 'VISA_CREDITO'}}";
        
		// Endpoint com somente os atributos necessários setados
		URL u = new URL("https://sandbox.evoluservices.com/remote/transaction");
        HttpURLConnection conn = (HttpURLConnection) u.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=utf8");
        conn.setRequestProperty(
                "Bearer",
                "xyz_456");
        OutputStream os = conn.getOutputStream();
        os.write(rawData.toString().getBytes("UTF-8"));
        os.close();

        StringBuilder sb = new StringBuilder();
        int HttpResult = conn.getResponseCode();
		
		// Se o resultado for HTTP OK, recebemos uma mensagem de sucesso
        if (HttpResult == HttpURLConnection.HTTP_OK) {
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));

            String line = null;
            while ((line = br.readLine()) != null) {
                sb.append(line + "\n");
            }
            br.close();
            System.out.println("" + sb.toString());

        } else {
			// Caso contrário, lemos o código e mensagem de erro
            System.out.println(conn.getResponseCode());
            System.out.println(conn.getResponseMessage());
        }

    }
```

```csharp
private static void createTransaction()
	{
		var request = (HttpWebRequest)WebRequest.Create("https://sandbox.evoluservices.com/remote/transaction");
		request.Method = "POST";
		request.ContentType = "application/json";
		request.Headers["Bearer"] = getToken();
		var requestStream = request.GetRequestStream();
		var auth = JsonConvert.SerializeObject(new { transaction = new { merchantId = "ABC123", value = "10.00", installments = "2", paymentBrand = "VISA_CREDITO" }});
		var buffer = Encoding.ASCII.GetBytes(auth);
		requestStream.Write(buffer, 0, buffer.Length);
		requestStream.Close();
		try
		{
			using (var response = (HttpWebResponse)request.GetResponse())
			{
				using (var responseStream = response.GetResponseStream())
				{
					using (var sr = new StreamReader(responseStream))
					{
						var transactionApproved = JsonConvert.DeserializeObject<dynamic>(sr.ReadToEnd());
						string transactionId = transactionApproved.transactionId.Value;
						Debug.WriteLine("TransactionID:" + transactionId);
					}
				}
			}
		}
		catch (WebException webException)
		{
			if (webException.Status == WebExceptionStatus.ProtocolError)
			{
				var response = webException.Response as HttpWebResponse;
				if (response == null)
				{
					Debug.WriteLine("Http Status:" + (int)response.StatusCode);
				}
			}
			throw webException;
		}
```

```json
{
  "transaction": { 
    "merchantId": "<id>",
    "terminalId": "<id>",
    "value": "10.00",
    "installments": 2,
    "paymentBrand": "VISA_CREDITO",
    "callbackUrl": "<url>",
    "clientName": "<name>",
    "installmentsCanChange" : "false",
    "clientEmail": "<email>"
  }
}
```

|Propriedade|Tipo|Obrigatório|Descrição|Validação|
|-----------|----|-----------|---------|---------|
|`merchantId`|Texto|Sim|Identificador da clínica ou profissional (obtido junto ao suporte).|`[0-9A-Za-z]+`|
|`terminalId`|Texto|Não|Id do terminal reponsável por processar a transação. Caso especificado, a transação iniciará automaticamente, caso contrário, uma notificação será exibida nos dispositivos habilitados. A lista de ids pode ser obtida através do método [Listar terminais](#listar-todos-os-terminais)|`[0-9A-Za-z+/*]{6,300}`|
|`value`|Número|Sim|Valor do orçamento (em decimal, com o "." como separador e 2 casas decimais).|`\d+\.\d{2}`|
|`installments`|Número|Não|Número de parcelas|`\d{1,9}`|
|`paymentBrand`|Texto|Não|Bandeira do cartão. Se o número de parcelas for especificado, a bandeira se torna *obrigatória*.|[Tabela de valores](#tabela-de-valores)|
|`callbackUrl`|Texto|Não|URL de retorno com os dados da transação após processamento. A URL deve ser https.|[URLValidator](https://commons.apache.org/proper/commons-validator/apidocs/org/apache/commons/validator/routines/UrlValidator.html) (Com schema apenas `https`)|
|`clientName`|Texto|Não|Nome do cliente final ao qual a transação pertence. Apesar de não obrigatório, recomenda-se fortemente que esse campo se preenchido.|`[0-9A-Za-záéíóúÁÉÍÓÚàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãõÃÕçÇäëïöüÄËÏÖÜ&!() #%@$+',-.]+`|
|`installmentsCanChange`|Booleano|Não|Define se o número de parcelas e a bandeira da transação podem ou não ser alterados pelo cliente.|<code>(true&#124;false)</code>|
|`clientEmail`|Texto|Não|Email do cliente, para onde pode ser enviado o comprovante da venda, opcionalmente|`.+`|

<aside class="warning">
  A URL de callback tem que ser https.
</aside>

### Resposta

```json
{
  "success": "true",
  "error": "REMOTE_TRANSACTION_SUCCESS",
  "transactionId": "NTcwMA*3"
}
```

**Em caso de sucesso**, retorna Status 200 e o json contendo transactionId e mensagem de sucesso.

<aside class="notice">Veja a seção <a href="#erros">Erros</a> para as respostas de requisições com erros.</aside>

## Callback

Se uma URL for enviada ao criar a transação, um JSON contendo os dados a seguir será enviado via POST quando o status da transação for alterado.

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
|`NSU`|Número|NSU da transação, disponível apenas depois de aprovada.|
|`authorizationNumber`|Número|Número de autorização da transação, disponível apenas depois de aprovada.|

### Parâmetros da parcela
|Propriedade|Tipo|Descrição|
|-----------|----|---------|
|`status`|Texto|Status da parcela.|
|`value`|Número|Valor da parcela, que será pago ao estabelecimento.|
|`number`|Número| Número da parcela.|
|`date`|Texto|Data estimada de pagamento da parcela.|

<aside class="notice">Veja a seção <a href="#tabela-de-valores">Tabela de Valores</a> para os possíveis status da transação e da parcela.</aside>

## Exclui Transação Remota

É possivel remover transações remotas que ainda não foram processadas, enviando uma requisição do tipo
Delete para a URL raiz da transação remota.

### Requisição HTTP
`DELETE /remote/{id}`

### Parâmetros da URL
|Parâmetro|Descrição|
|---------|---------|
|`id`|Identificador da transação remota (retornada na requisição da transação).|

<aside class="warning">
  A requisição precisa incluir um <b>token de autenticação válido</b> no header.
</aside>

# Terminais

## Listar todos os terminais

Retorna os terminais do estabelecimento que estão aptos a receber transação remota.

### Requisição HTTP
`GET /remote/merchants/{merchantCode}/terminals`

### Header

Você deve especificar no cabeçalho da requisição o tipo de conteúdo enviado no corpo, bem como o token de acesso.

|Parâmetro|Valor|
|---------|-----|
|`Content-Type`|`application/json`|
|`Bearer`|`TOKEN`|

> ```Content-Type application/json```

> ```Bearer TOKEN```

### Parâmetros da URL
|Parâmetro|Descrição|
|---------|---------|
|`merchantCode`|O código do estabelecimento ou profissional (obtido junto ao suporte).|

### Resposta

```json
[
    {
        "macAddress": "8d:c1:d3:12:14:bb",
        "computerName": "DESKTOP",
        "terminalId": "AA009999"
	}
]
```

|Propriedade|Tipo|Descrição|
|-----------|----|---------|
|`macAddress`|Texto|O endereço físico (MAC Address) associado ao terminal.|
|`computerName`|Texto|O nome do computador associado ao terminal.|
|`terminalId`|Texto|O id do terminal que pode ser utilizado como parâmtro para [iniciar uma transação remota](#cria-transa-o-remota).|
