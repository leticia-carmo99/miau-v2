export default `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Folha de Estilo Leaflet (100% gratuita e open source) -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        crossorigin=""/>
    <style>
        /* CSS Básico para ocupar 100% do WebView */
        body { margin: 0; padding: 0; background-color: #f0f0f0; }
        #map { height: 100vh; width: 100vw; }
        /* Garante que o div de carregamento/fallback não apareça se o mapa carregar */
        .loading-text { display: none; } 
    </style>
</head>
<body>
    <!-- Div que o Leaflet vai usar para renderizar o mapa -->
    <div id="map">
        <!-- Adicionei um texto de fallback para debug -->
        <p class="loading-text">Carregando mapa...</p>
    </div>

    <!-- Script Leaflet (100% gratuita e open source) -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        crossorigin=""></script>
    
    <script>
        // O código de inicialização será injetado pelo React Native
    </script>
</body>
</html>
`;
