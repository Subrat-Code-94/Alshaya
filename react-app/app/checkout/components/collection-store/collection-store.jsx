/* eslint-disable */
/** TO DO: WIP and Eslints will be fixed with story completion */
import React, { useEffect, useRef, useState } from 'react';
import './collection-store.css';
import Icon from '../../../../library/icon/icon';
import { getConfigValue } from '../../../../../scripts/configs';
import mockData from './mockData.json';

const generateStoreHours = (storeHours) => {
  let time;
  let days = [];
  const resArr = [];
  storeHours.forEach((hours, index) => {
    if (!days.length) {
      days.push(hours.label);
      time = hours.value;
    }
    if (time === hours.value) {
      days.splice(1, 1, hours.label);
    } else {
      resArr.push({ label: days.join(' - '), value: time });
      days = [];
      days.push(hours.label);
      time = hours.value;
    }
    if (index === storeHours.length - 1) {
      resArr.push({ label: days.join(' - '), value: time });
    }
  });
  return resArr;
};

let deskMap;

function CollectionStore() {
  const [activeView, setActiveView] = useState('list_view');
  const [openedAdd, setOpenedAdd] = useState(null);
  const [selectedAdd, setSelectedAdd] = useState(null);
  const [isResponsive, setIsResponsive] = useState(null);
  const [currentLocation, setCurrentLocation] = useState();
  const [allStoreHours, setAllStoreHours] = useState();
  const [allMarkers, setAllMarkers] = useState();
  const mapRefMobile = useRef(null);
  const mapRefDesktop = useRef(null);
  const infoWindowRef = useRef(null);

  const storeInfoRenderer = (item) => {
    let t = '';
    allStoreHours[item.id].forEach((hours) => {
      t = `${t}<div><span>${hours.label}</span><span> (${hours.value})</span></div>`;
    });

    return `<div class="collection-map-infowindow">
            <div class="collection-map-infowindow-title"><span class="collection-map-infowindow-name">${item.store_name}</span><span> 11.32 miles</span></div>
            <div>Alrayan , Doha Qatar Doha Al Rayyan</div>
            <div class="collection-map-infowindow-time"><span>Collect in store from</span><span> ${item.sts_delivery_time_label}</span></div>
            <div>${t}</div>
        </div>`;
  };

  const viewClickHandler = (view) => {
    setActiveView(view);
  };

  const addDropdownClick = (add) => {
    if (add === openedAdd) {
      setOpenedAdd(null);
    } else {
      setOpenedAdd(add);
    }
  };
  const selectAddClick = (item) => {
    setSelectedAdd(item.id);
    deskMap.setCenter({ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) });
    deskMap.setZoom(12);

    infoWindowRef.current.setContent(storeInfoRenderer(item));

    // allMarkers[item.id].addListener("click", () => {
    infoWindowRef.current.open(deskMap, allMarkers[item.id]);
    // });
  };

  const loadMapScript = async () => {
    const googleMapKey = '' || await getConfigValue('sf-google-maps-key');
    const scripts = [`https://maps.googleapis.com/maps/api/js?key=${googleMapKey}&async=true`];
    // add script dependencies to the page and wait for them to load
    await Promise.all(scripts.map((script) => new Promise((resolve) => {
      const scriptElement = document.createElement('script');
      scriptElement.id = 'checkout-google-map';
      scriptElement.src = script;
      scriptElement.onload = resolve;
      scriptElement.type = 'module';
      document.head.appendChild(scriptElement);
    })));
  };

  async function initiateGoogleMap() {
    !document.getElementById('checkout-google-map') && await loadMapScript();
    const google = await window.google;
    const markerLibrary = await google.maps.importLibrary('marker');
    const { AdvancedMarkerElement } = markerLibrary;
    if (!google) {
      return;
    }
    const defaultCenterLat = '' || await getConfigValue('sf-maps-center-lat');
    const defaultCenterLng = '' || await getConfigValue('sf-maps-center-lng');
    const defaultZoom = '' || await getConfigValue('sf-maps-default-zoom-preference');
    const defaultSelectionZoom = '' || await getConfigValue('sf-maps-selection-zoom-preference');
    // const {currentLat, currentLng} = await getCurrentLocation();
    const mapOptions = {
      zoom: Number(defaultZoom),
      center: new google.maps.LatLng(Number(defaultCenterLat), Number(defaultCenterLng)),
      mapId: 'ALSHAYA_MAP_ID',
      disableDefaultUI: true,
      zoomControl: true,
    };

    if (mapRefMobile?.current) {
      const mobMap = new google.maps.Map(mapRefMobile.current, mapOptions);
    }

    if (mapRefDesktop?.current) {
      deskMap = new google.maps.Map(mapRefDesktop.current, mapOptions);
    }

    const parsedData = mockData;
    const markers = {};
    const store_hours = {};
    parsedData.data.storeLocationDetails.items.forEach((item, i) => {
      store_hours[item.id] = generateStoreHours(item.store_hours);
      const marker = new markerLibrary.AdvancedMarkerElement({
        position: { lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) },
        content: new markerLibrary.PinElement({
          background: '#FFFFFF',
          borderColor: '#FF0000',
          glyph: i.toString(),
          glyphColor: 'white',
        }).element,
        title: item.store_name,
      });
      // marker.addListener("click", () => {
      //     infoWindowRef.current.setContent(storeInfoRenderer(item))
      //     infoWindowRef.current.open(deskMap, marker);
      // });
      markers[item.id] = marker;
    });

    setAllStoreHours(store_hours);
    setAllMarkers(markers);
    Object.values(markers).forEach((marker) => marker.setMap(deskMap));
    // Object.values(allMarkers).forEach((marker) => marker.setMap(map));
    infoWindowRef.current = new google.maps.InfoWindow();
  }

  const getCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentLocation({
        currentLat: latitude,
        currentLng: longitude,
      });
    });
  };

  useEffect(() => {
    if (activeView === 'map_view') {
      initiateGoogleMap();
    }
  }, [activeView]);

  const checkMatchMedia = (threshold) => {
    if (window.matchMedia(`(max-width: ${threshold})`).matches) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    initiateGoogleMap();
  }, [currentLocation]);

  useEffect(() => {
    getCurrentLocation();
    // window.dispatchEvent(new CustomEvent('react:mapEssentials', { detail: { ref: mapRefDesktop.current} }));
    setIsResponsive(checkMatchMedia('767.5px'));

    window.addEventListener('resize', () => {
      setIsResponsive(checkMatchMedia('767.5px'));
    });
  }, []);

  return (
  // <div ref={mapRefDesktop}></div>
    <div className="collection-store-main">
      <div ref={mapRefDesktop} className="collection-store-map-wrapper" />
      <div className="collection-store-wrapper">
        <div className="collection-store-title">Collection Store</div>
        <div className="collection-store-content">
          <div className="collection-store-warning">
            <div className="collection-store-warning-icon">
              <Icon name="warning" />
            </div>
            <div className="collection-store-warning-content">
              <div className="collection-store-warning-title">You are browsing outside Kuwait.</div>
              <div className="collection-store-warning-desc">We currently don’t offer delivery outside Kuwait. Please enter an address within Kuwait below to proceed.Please select a store with in country Qatar below to continue.</div>
              <a className="collection-store-warning-action">Dismiss</a>
            </div>
          </div>
          <div className="collection-store-find-label">Find Your Nearest Store</div>
          <div className="collection-store-input-container">
            <div className="collection-store-input-div">
              <div className="collection-store-input-wrapper">
                <div className="collection-store-input-icon"><Icon name="search" /></div>
                <input className="collection-store-input" type="text" placeholder="eg. Doha" />
              </div>
            </div>
            <div className="collection-store-location-icon">
              <Icon name="locate" />
            </div>
          </div>
          <div className="collection-store-btn-container">
            <div className="collection-store-btn-wrapper">
              <button className={activeView === 'list_view' ? '' : 'secondary'} onClick={() => viewClickHandler('list_view')}>List view</button>
              <button className={activeView === 'map_view' ? '' : 'secondary'} onClick={() => viewClickHandler('map_view')}>Map view</button>
            </div>
          </div>
          {activeView === 'list_view' && (
          <div className="collection-store-add-container">
            <ul>
              {mockData.data.storeLocationDetails.items.map((item) => (
                <li>
                      <a onClick={() => selectAddClick(item)} className="collection-store-add-line">
                        <div className="collection-store-name-holder">
                              <div className="collection-store-name-radio">
                                <input type="radio" readOnly checked={selectedAdd === item.id} />
                              </div>
                              <div className="collection-store-name">{item.store_name}</div>
                            </div>
                        <div className="collection-store-distance">
                              <div>5.25 miles</div>
                              {isResponsive && (
                              <a onClick={() => addDropdownClick(item.id)}>
              <Icon className={item.id === openedAdd ? 'caret-icon-div show' : 'caret-icon-div'} name="caret-up-fill" />
              <Icon className={item.id !== openedAdd ? 'caret-icon-div show' : 'caret-icon-div'} name="caret-down-fill" />
            </a>
                              )}
                            </div>
                      </a>
                      {isResponsive && item.id === openedAdd && (
                      <div className="collection-store-li-add">
                            <div>Alrayan , Doha Qatar Doha Al Rayyan</div>
                            <div className="collection-store-time">
                              <span>Collect in store from</span>
                              <span>
              {' '}
              {item.sts_delivery_time_label}
            </span>
                            </div>
                            <div>
                              {allStoreHours[item.id].map((hours) => (
              <div>
          <span>{hours.label}</span>
          <span>
  {' '}
  ({hours.value}
  )
</span>
        </div>
            ))}
                            </div>
                          </div>
                      )}
                    </li>
              ))}
            </ul>
          </div>
          )}
          {activeView === 'map_view' && <div ref={mapRefMobile} className="collection-store-mobile-map" />}
        </div>
        <div className="collection-store-submit">
          <button>Select this store</button>
        </div>
      </div>
    </div>
  );
}

export default CollectionStore;
