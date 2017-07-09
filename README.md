Sender agent node

Run with `node index [PORT]` 
PORT(number) is optional.

Sends plain text emails.

Sample configuration file:

```
{
  "PORT" : 3003,
  "MASTER_URI" : "http://localhost:3002",
  "transport" : {
    "host": "smtp.mailtrap.io",
    "port": 2525,
    "auth": {
      "user": "6d8705b187786e",
      "pass": "54549421d13eaa"
    }
  }
}

```

"PORT" is default tokenizer port, whet it is started with command node index <PORT> the port passed as argument is used.

"MASTER_URI" is URI of master server.
