<!doctype html>
<html lang="es">
    <head>
        <title>Inicio</title>
        <!-- Required meta tags -->
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink
to-fit=no"
        />
        <!-- Bootstrap CSS -->
        <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        />
    </head>
    <body>
        <div class="container">
            <nav>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/portafolio">Portafolio</a></li>
                    <li><a href="/acerca">Acerca de</a></li>
                    <li><a href="/contacto">Contacto</a></li>
                </ul>
            </nav>
            <h1>Home</h1>
            Bienvenido  {{$nombre ?? "Invitado"}}
        </div>
    </body>
</html>
