// 카카오 맵 초기화
const serverUrl = `${CONFIG.SERVER_URL}`;
function initMap() {
  Kakao.init("c64d5a95eaf27fff976cee2b17b6d4c2"); // 카카오 API 키 설정
  const mapContainer = document.getElementById("map");
  const mapOption = {
    center: new kakao.maps.LatLng(37.564314, 126.938924),
    level: 3,
  };
  const map = new kakao.maps.Map(mapContainer, mapOption);

  // 데이터베이스에서 location 정보 가져오기
  fetch(`${serverUrl}/api/locations`)
    .then((response) => response.json())
    .then((locations) => {
      locations.forEach((location) => {
        const markerPosition = new kakao.maps.LatLng(
          location.latitude,
          location.longitude
        );
        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);

        // 마커 클릭 시 info window 표시
        const infoWindow = new kakao.maps.InfoWindow({
          content: `<div class="info-window">
                                <h4>${location.name}</h4>
                                <button onclick="viewBoardPosts('${location.id}')">분실물 게시판 보기</button>
                              </div>`,
        });
        kakao.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        });
      });
    })
    .catch((error) => console.error("Error loading locations:", error));
}

// 지도 보기 클릭 시 지도 섹션 표시
function openMapView() {
  document.querySelector(".options").classList.add("hidden");
  document.querySelector("#map-view").classList.remove("hidden");
  initMap();
}

// 특정 위치의 board posts 보기
function viewBoardPosts(locationId) {
  fetch(`/api/locations/${locationId}/board-posts`)
    .then((response) => response.json())
    .then((posts) => {
      // 여기에 post 목록을 표시하는 코드를 추가하세요
    })
    .catch((error) => console.error("Error loading board posts:", error));
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("homeBtn").addEventListener("click", () => {
    // 홈 버튼 클릭 시 초기화
    document.querySelector(".options").classList.remove("hidden");
    document.querySelector("#map-view").classList.add("hidden");
  });
});
