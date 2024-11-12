const serverUrl = `${CONFIG.SERVER_URL}`;

document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json(); // 서버로부터 JWT 토큰을 포함한 응답 받기

        // 사용자 정보를 localStorage에 저장
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: loginData.email, // 이메일 저장
            username: data.username, // username이 서버에서 반환된 경우
            accessToken: data.access_token, // JWT 토큰 저장
          })
        );
        window.location.href = "../../index.html"; // 대시보드 페이지로 리디렉션
      } else {
        const errorData = await response.json(); // JSON 응답 받기
        throw new Error(errorData.message || "로그인에 실패했습니다."); // 에러 메시지
      }
    } catch (error) {
      alert(error.message); // 에러 메시지 표시
    }
  });
