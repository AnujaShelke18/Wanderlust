mapboxgl.accessToken = mapToken;

if (listing.geometry && listing.geometry.coordinates) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates,
    zoom: 9
  });

  const box = document.createElement("div");
  const heading = document.createElement("h4");
  const msg = document.createElement("p");
  heading.textContent = listing.title;
  msg.textContent = "Exact location will be provided after booking";
  box.appendChild(heading);
  box.appendChild(msg);
  new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 })
    .setDOMContent(box)
    )
    .addTo(map);
} else {
  console.warn(" No coordinates found for this listing. Map not displayed.");
}
