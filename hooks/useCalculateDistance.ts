// La función degreesToRadians convierte un valor en grados a radianes. Esto es necesario para realizar cálculos trigonométricos más adelante. La fórmula para convertir de grados a radianes es radianes = grados * (π / 180).
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}


// La función useCalculateDistance toma como entrada las coordenadas de latitud (lat1, lat2) y longitud (lon1, lon2) de dos puntos en la Tierra.
export function useCalculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
  ): number {
    // Se define earthRadiusKm como el radio de la Tierra en kilómetros, que se utiliza en el cálculo final.
    const earthRadiusKm = 6371; // Radio de la Tierra en kilómetros
    
    
    // Se calcula la diferencia en latitud (dLat) y longitud (dLon) entre los dos puntos y se convierten a radianes utilizando la función degreesToRadians.
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    
    // Se utiliza la fórmula de Haversine para calcular la distancia entre los puntos.
    // a = sin²(Δlat/2) + cos(lat1) * cos(lat2) * sin²(Δlon/2)
    // c = 2 * atan2(√a, √(1-a))
    // distance = earthRadius * c
    const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
    Math.cos(degreesToRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Donde:
    // Δlat es la diferencia en latitud en radianes.
    // Δlon es la diferencia en longitud en radianes.
    // lat1 y lat2 son las latitudes de los dos puntos en radianes.
    // earthRadius es el radio de la Tierra en kilómetros.
    // c es el ángulo central subtendido por los dos puntos, calculado utilizando la función atan2.
    
    
    // El resultado del cálculo se devuelve como la distancia entre los dos puntos en kilómetros.
    // Si se quiere el resultado en metros en lugar de kilómetros, multiplica el resultado final por 1000.
  return earthRadiusKm * c * 1000;
}






