const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        let {latitude, longitude} = position.coords;
        socket.emit("send-location",{latitude, longitude});
    },(error)=>{
        console.log("GEO error",error);
    },{
    enableHighAccuracy: true,
    timeout:5000,
    maximumAge:0
    }
    );
}

const map = L.map("map").setView([0,0], 16)
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map)

const markers = {};

socket.on("receive-location", (data)=>{
    console.log(data)
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude])
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]).addTo(map);
    }else{
        markers[id] = L.marker([latitude, longitude])
    }
})

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})
