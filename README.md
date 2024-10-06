<h1>proyectoArqui</h1>

## Instalación

1. Clonar repositorio.
   ```sh
   git clone https://github.com/Tatiana-Quilca/proyectoArqui.git proyectoArqui 
   cd proyectoArqui
   code .

2. Backend
    ```sh
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate --seed
    php artisan serve

3. Frontend
    ```sh
    npm install
    npm run dev
    
## Usuarios del Sistema

| Nombre         | Nombre de Usuario | Email               | Contraseña  |
|----------------|-------------------|---------------------|-------------|
| Admin User     | admin             | admin@example.com   | password    |
| arquitecto revisor| arquitecto     | arquitecto@example.com| password    |
| secretaria   | secretaria          | secretaria@example.com | password    |

