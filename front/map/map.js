let map;
const yonseiCenter = { lat: 37.564314, lng: 126.938924 };
const locUrl = `${CONFIG.SERVER_URL}/api/locations`;
let activeInfoWindow = null; // 현재 활성화된 인포윈도우 추적

function initMap() {
  // 지도 초기화
  map = new kakao.maps.Map(document.getElementById("map"), {
    center: new kakao.maps.LatLng(yonseiCenter.lat, yonseiCenter.lng),
    level: 3,
  });

  // 지도 클릭 시 활성화된 인포윈도우 닫기
  kakao.maps.event.addListener(map, "click", () => {
    if (activeInfoWindow) {
      activeInfoWindow.close();
      activeInfoWindow = null;
    }
  });

  // 서버에서 위치 정보를 불러오기
  fetch(locUrl)
    .then((response) => response.json())
    .then((locations) => {
      locations.forEach((location) => {
        const markerPosition = new kakao.maps.LatLng(
          location.latitude,
          location.longitude
        );

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position: markerPosition,
          map: map,
        });

        // 인포윈도우 생성
        const infowindow = new kakao.maps.InfoWindow({
          content: `<div class="infowindow">
                      <strong>${location.name}</strong><br/>
                      <button onclick="openBoard('${location.id}')">게시판 보기</button>
                    </div>`,
        });

        // 마커 클릭 시 인포윈도우 표시
        kakao.maps.event.addListener(marker, "click", () => {
          // 기존의 활성화된 인포윈도우가 있으면 닫기
          if (activeInfoWindow) {
            activeInfoWindow.close();
          }

          // 클릭한 마커에 대한 인포윈도우 열기
          infowindow.open(map, marker);
          activeInfoWindow = infowindow; // 현재 인포윈도우를 활성 상태로 설정
        });
      });
    })
    .catch((error) => console.error("Error loading locations:", error));
}

// 게시판 열기
function openBoard(locationId) {
  const boardPageUrl = `../board/board.html?locationId=${locationId}`;
  window.location.href = boardPageUrl;
}

// 뒤로가기 기능
function goBack() {
  window.history.back();
}

//홈으로
function goHome() {
  window.location.href = "../index.html";
}

// 페이지 로드 시 지도 초기화
window.onload = initMap;
