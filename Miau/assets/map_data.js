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
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; background-color: #f0f0f0; }
        #map { height: 100%; width: 100%; }
        /* Garante que o div de carregamento/fallback não apareça se o mapa carregar */
        .loading-text { display: none; } 
    </style>
</head>
<body>
    <!-- Div que o Leaflet vai usar para renderizar o mapa -->
    <div id="map">
        <p class="loading-text">Carregando mapa...</p>
    </div>

    <!-- Script Leaflet (100% gratuita e open source) -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        crossorigin=""></script>
    
    <script>
        // O código de inicialização será injetado pelo React Native
        
        // Vamos pré-carregar os Tile Providers do Leaflet aqui
        const L_PROVIDERS = {
            // [1] OPÇÃO ATUAL (Estilo Google Maps Limpo)
            'Esri_WorldStreetMap': {
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                attribution: 'Tiles &copy; Esri'
            },
            // [2] NOVO: Estilo Clean/Minimalista/Claro (Ótimo para Mobile)
            'CartoDB_Positron': {
                url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            // [3] NOVO: Estilo Preto e Branco de Alto Contraste (Único)
            'Stamen_TonerLite': {
                url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
            },
            // [4] Estilo Escuro / Dark Mode
            'CartoDB_DarkMatter': {
                url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            // [5] Estilo Satélite / Foto Aérea (O que você achou feio)
            'Esri_WorldImagery': {
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                attribution: 'Tiles &copy; Esri'
            },
            // [6] OSM Padrão (Manteremos para referência)
            'OpenStreetMap_Standard': {
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }
        };
    </script>
</body>
</html>
`;