<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Actualización de Estado de Trámite</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
            text-align: center;

        }
        .footer {
            background-color: #f4f4f4;
            padding: 10px;
            text-align: center;
            font-size: 0.8em;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Actualización de su Trámite</h1>
    </div>
    <div class="content">
        <p>Estimado/a {{ $detalles['propietario'] }},</p>
        <p>Le informamos que el estado de su trámite ha sido actualizado.</p>
        <p><strong>Nuevo estado:</strong> {{ $detalles['estado_tramite'] }}</p>
        <p><strong>Número de trámite:</strong> {{ $detalles['tramite'] }}</p>
        <p>Si tiene alguna pregunta o necesita más información, no dude en contactarnos.</p>
        <p>Gracias por su atención.</p>
    </div>
    <div class="footer">
        <p>Este es un correo automático, por favor no responda a este mensaje.</p>
    </div>
</body>
</html>