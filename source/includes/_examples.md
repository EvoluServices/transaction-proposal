# Exemplos

Exemplos de utilização em Java

## Transação

<pre>
 public static void main(String[] args) throws IOException {
        String rawData = "{'transaction': { 'merchantId': 'MjIxNzA*7*','value': '10.00','installments': '2','paymentBrand': 'VISA_CREDITO'}}";
        URL u = new URL("https://staging.evoluservices.com/remote/transaction");
        HttpURLConnection conn = (HttpURLConnection) u.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=utf8");
        conn.setRequestProperty(
                "Bearer",
                "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI1IiwiaWF0IjoxNDkwODEyMzY0LCJleHAiOjE0OTg3NjExNjQsInN1YiI6ImNvbnRyb2xlb2RvbnRvIn0.Vp2GSm3ZWzK62uXWJAri5JyzC9AqEjQcNYvYpcA1fbrOMqg_vo2UQCtiwzC9TR_UyYEmCQNZHSLGideaGpLYBg");
        OutputStream os = conn.getOutputStream();
        os.write(rawData.toString().getBytes("UTF-8"));
        os.close();

        StringBuilder sb = new StringBuilder();
        int HttpResult = conn.getResponseCode();
        if (HttpResult == HttpURLConnection.HTTP_OK) {
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));

            String line = null;
            while ((line = br.readLine()) != null) {
                sb.append(line + "\n");
            }
            br.close();
            System.out.println("" + sb.toString());

        } else {
            System.out.println(conn.getResponseCode());
            System.out.println(conn.getResponseMessage());
        }

    }
</pre>


