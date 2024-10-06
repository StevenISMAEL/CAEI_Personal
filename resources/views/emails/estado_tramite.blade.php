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
            background-color: #f9f9f9;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .container {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
            overflow: hidden;
        }
        .header, .footer {
            background-color: #fa2623;
            color: white;
            padding: 15px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 1.5em;
        }
        .content {
            padding: 20px;
        }
        .footer {
            font-size: 0.8em;
        }
        @media (max-width: 480px) {
            body {
                padding: 10px;
            }
            .container {
                max-width: 100%;
            }
            .header h1 {
                font-size: 1.2em;
            }
            .content {
                padding: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
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
    </div>
</body>
</html>