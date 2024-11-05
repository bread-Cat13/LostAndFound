const locationId = new URLSearchParams(window.location.search).get(
  "locationId"
);
let boardId; // 전역 변수로 설정하여 다른 함수에서도 사용 가능
const serverIPandPort = `${CONFIG.SERVER_URL}`;

async function loadBoardData() {
  try {
    const response = await fetch(
      `${serverIPandPort}/api/locations/board-posts?loc=${locationId}`
    );
    const data = await response.json();

    //title 수정
    document.title = `${data.board.name}`;

    // boardId를 전역 변수로 저장
    boardId = data.board.id;

    // 게시판 제목 설정
    document.getElementById("board-title").textContent = `${data.board.name}`;

    // 게시물 표시
    const postsContainer = document.getElementById("posts-container");
    const noPostMessage = document.getElementById("no-post-message");

    if (data.board.posts.length === 0) {
      noPostMessage.style.display = "block";
    } else {
      noPostMessage.style.display = "none";
      data.board.posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "post-item";
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.content}</p>
          <button onclick="viewPost('${post.id}')">상세보기</button>
        `;
        postsContainer.appendChild(postElement);
      });
    }
  } catch (error) {
    console.error("Error loading board data:", error);
  }
}

// 게시물 등록 페이지로 이동
function goToRegister() {
  window.location.href = `../register/register.html?locationId=${locationId}&boardId=${boardId}`;
}

// 지도 페이지로 이동
function goToMap() {
  window.location.href = `../map/map.html`;
}

// 게시물 상세 페이지로 이동
function viewPost(postId) {
  window.location.href = `../post/post.html?postId=${postId}&locationId=${locationId}`;
}

window.onload = loadBoardData;
