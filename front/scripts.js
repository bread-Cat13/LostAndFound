// 페이지 로드 시 로그인 상태 확인
document.addEventListener("DOMContentLoaded", () => {
  const userNav = document.getElementById("user-nav");

  // 로그인 정보 확인
  const user = JSON.parse(localStorage.getItem("user")); // 로그인 시 저장한 사용자 정보

  if (user) {
    // 사용자 이름이 존재하는 경우
    userNav.innerHTML = `
          <span style="color: white;">안녕하세요, ${user.username}님!</span>
          <a href="#" id="logout-link">로그아웃</a>
      `;

    // 로그아웃 클릭 이벤트 처리
    document.getElementById("logout-link").addEventListener("click", () => {
      localStorage.removeItem("user"); // 사용자 정보 삭제
      window.location.href = "./index.html"; // 로그아웃 후 메인 페이지로 이동
    });
  } else {
    // 로그인하지 않은 경우
    userNav.innerHTML = `
          <a href="./users/login/login.html">로그인</a>
          <a href="./users/signup/signup.html">회원가입</a>
      `;
  }
});

document.getElementById("search-tab").addEventListener("click", () => {
  alert("서비스 준비중입니다.");
});
