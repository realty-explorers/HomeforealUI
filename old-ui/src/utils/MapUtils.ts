import MapMarker from "../models/marker";

const exportMap = (mapOptions: any, markers: MapMarker[]) => {
    console.log(markers)
    let staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";
    staticMapUrl += "?center=" + mapOptions.center.lat + "," + mapOptions.center.lng;
    staticMapUrl += "&size=220x350";
    staticMapUrl += "&zoom=" + mapOptions.zoom;
    staticMapUrl += "&maptype=" + mapOptions.mapTypeId;
    for (const marker of markers) {
        staticMapUrl += `&markers=color:red|${marker.latitude},${marker.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
    }
    return staticMapUrl;
}

export { exportMap };