import React from 'react';

import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import {HeatmapLayer} from 'react-leaflet-heatmap-layer-v3';

const Map = ({data}) => {

    // console.log(data);
    return (
        <MapContainer center={[39.5, -98.35]} zoom={8} scrollWheelZoom={true} style={{height: '100%', width: '100%', borderRadius: 'inherit'}}>
            <LayersControl>
                <LayersControl.BaseLayer name='Base' checked>
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                    
                    </LayersControl.BaseLayer>
                <LayersControl.Overlay checked name='Sales'>
                    <HeatmapLayer
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={data}
                    longitudeExtractor={m => m.lng}
                    latitudeExtractor={m => m.lat}
                    intensityExtractor={m => parseFloat(m.count_intensity)}
                    max={3}
                    radius={15}
                    />
                </LayersControl.Overlay>
                <LayersControl.Overlay name='Warranty'>
                    <HeatmapLayer
                    fitBoundsOnLoad
                    fitBoundsOnUpdate
                    points={data}
                    longitudeExtractor={m => m.lng}
                    latitudeExtractor={m => m.lat}
                    intensityExtractor={m => parseFloat(m.warr_intensity)}
                    max={3}
                    radius={15}
                    />
                </LayersControl.Overlay>

            </LayersControl>
            {/* <Marker position={[39.5, -98.35]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker> */}
        </MapContainer>
    );
}

export default Map;