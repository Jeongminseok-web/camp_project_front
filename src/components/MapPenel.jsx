import React, { useCallback, useEffect, useRef } from 'react';

const MapPenel = ({ center, zoom, regionData }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const initMap = useCallback(() => {
    // 구글 맵 초기화
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
    });
  }, [center, zoom]);

  const addMarkers = useCallback((data) => {
    // 기존 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    data.forEach((item) => {
      if (item.mapY && item.mapX) {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(item.mapY), lng: parseFloat(item.mapX) },
          map: mapInstanceRef.current,
          title: item.facltNm, // 캠핑장 이름
        });

        // 마커 클릭 이벤트로 팝업 표시
        const infoWindow = new window.google.maps.InfoWindow({
          // css에 스타일 추가
          content: `
            <div class="custom-info-window">
              <h3>${item.facltNm}</h3>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        // 마커 배열에 추가
        markersRef.current.push(marker);
      }
    });
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) {
      initMap();
    } else {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
    }

    // 마커 추가
    if (regionData && regionData.length > 0) {
      addMarkers(regionData);
    }
  }, [center, zoom, regionData, initMap, addMarkers]);

  return <div className="map w-[80%] h-[100%]" ref={mapRef}></div>;
};

export default MapPenel;
