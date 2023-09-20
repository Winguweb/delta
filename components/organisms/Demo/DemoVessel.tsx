import { Bounds } from "google-map-react";
import { FC, useEffect, useState } from "react";
import { LatLngLike, computeDistanceBetween, computeLength } from "spherical-geometry-js";
import { setSourceMapRange } from "typescript";
import { Coordinates } from "../../../model/map";
import { Marker } from "../../molecules/Marker";



const pingFreq = 1000 //ms

class LanchaState {
    kmActual = 0;
    signo = 1;
    speed: number;
    path: Coordinates[];
    total: number;
    constructor(speed: number, path: Coordinates[], total: number) {
        this.speed = speed;
        this.path = path;
        this.total = total;
    }

    avanzar() {
        const recorridoPorPing = pingFreq * this.speed / (60 * 60 * 1000);
        this.kmActual += recorridoPorPing * this.signo;
        if (this.kmActual > this.total) {
            this.kmActual = this.total
            this.signo = -1
        }

        if (this.kmActual < 0) {
            this.kmActual = 0
            this.signo = 1
        }

        var posicion: Coordinates = this.path[this.path.length - 1];
        var distanciaRecorrida = this.kmActual;
        for (let index = 0; index < this.path.length - 1; index++) {
            const distanciaSegmento = computeDistanceBetween(this.path[index], this.path[index + 1]) / 1000;

            if (distanciaRecorrida <= distanciaSegmento) {
                const fraccion = distanciaRecorrida / distanciaSegmento;
                posicion = interpolar(this.path[index], this.path[index + 1], fraccion);
                break;
            } else {
                distanciaRecorrida -= distanciaSegmento;
            }
        }

        return posicion;
    }
}

export const DemoVessel: FC<{ lat: number, lng: number, setter: ((value: Coordinates) => void), path: Coordinates[], name: string, speed?: number, coordsCasa: Coordinates, bounds: Bounds | null }> = ({ path, name, speed = 75, coordsCasa, bounds, setter, lat, lng }) => {

    const [notificado, setNotificado] = useState(false);

    const total = computeLength(path) / 1000;

    const [lancha, setLancha] = useState(new LanchaState(speed, path, total));


    useEffect(() => {
        const interval = setInterval(() => {
            const newPosition = lancha.avanzar();
            setter(newPosition);

        }, pingFreq);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        if (computeDistanceBetween({ lat, lng }, coordsCasa) <= 150) {
            if (!notificado) {
                setNotificado(true);
                new Notification(`Deltapp`, {
                    icon: '/favicon.ico',
                    body: `La embarcación ${name} está a 150 metros`
                })
            }
        } else {
            setNotificado(false);
        }
    }, [lat, lng, coordsCasa, notificado, name])


    const isOnScreen = bounds !== null &&
        resultWithinBoundaries({ lat, lng }, bounds);

    return isOnScreen && <Marker
        key={`Vessel ${name}`}
        lat={lat}
        lng={lng}
        onClick={() => {
        }}
    />
}

function interpolar(desde: Coordinates, hacia: Coordinates, cuanto: number) {
    return {
        lat: desde.lat + ((hacia.lat - desde.lat) * cuanto),
        lng: desde.lng + ((hacia.lng - desde.lng) * cuanto),
    }
}

function resultWithinBoundaries(
    marker: Coordinates,
    bounds: Bounds
) {
    const northLat = bounds.nw.lat;
    const southLat = bounds.sw.lat;
    const westLng = bounds.nw.lng;
    const eastLng = bounds.ne.lng;
    return (
        marker.lat < northLat &&
        marker.lat > southLat &&
        marker.lng > westLng &&
        marker.lng < eastLng
    );
};