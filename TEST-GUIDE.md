# 테스트 가이드

브라우저에서 주소 검색 기능을 테스트하는 방법입니다.

---

## ⚠️ 중요: 로컬 서버 필요

브라우저 보안 정책(CORS) 때문에 HTML 파일을 직접 더블클릭해서 열면 (`file://` 프로토콜) JavaScript 모듈이 작동하지 않습니다.

**반드시 로컬 웹 서버를 실행해야 합니다!**

---

## 방법 1: Python 간단 서버 (추천 ⭐)

Python이 설치되어 있다면 가장 간단합니다.

### Python 3.x

```bash
cd "C:\Users\xfs50r\OneDrive - HellermannTyton\Desktop\Devguru\independent-address-kr"

# 서버 실행
python -m http.server 8000
```

### Python 2.x

```bash
cd "C:\Users\xfs50r\OneDrive - HellermannTyton\Desktop\Devguru\independent-address-kr"

# 서버 실행
python -m SimpleHTTPServer 8000
```

### 접속

브라우저에서 열기:
- http://localhost:8000/examples/simple-test.html
- http://localhost:8000/examples/with-config.html
- http://localhost:8000/examples/basic.html

---

## 방법 2: Node.js http-server

```bash
# 전역 설치 (한 번만)
npm install -g http-server

# 프로젝트 폴더로 이동
cd "C:\Users\xfs50r\OneDrive - HellermannTyton\Desktop\Devguru\independent-address-kr"

# 서버 실행
http-server -p 8000
```

브라우저에서:
- http://localhost:8000/examples/simple-test.html

---

## 방법 3: VS Code Live Server

1. VS Code 설치
2. "Live Server" 확장 프로그램 설치
3. HTML 파일 우클릭 → "Open with Live Server"

---

## 방법 4: npx serve (설치 불필요)

```bash
cd "C:\Users\xfs50r\OneDrive - HellermannTyton\Desktop\Devguru\independent-address-kr"

# 한 줄로 실행 (설치 없이)
npx serve
```

브라우저에서:
- http://localhost:3000/examples/simple-test.html

---

## 테스트 파일 목록

### 1. simple-test.html (⭐ 가장 간단)

```
http://localhost:8000/examples/simple-test.html
```

**특징:**
- 가장 간단한 예제
- 테스트용 API 키 내장
- 바로 테스트 가능

**사용법:**
1. 서버 실행
2. 브라우저에서 열기
3. 주소 검색 시작!

---

### 2. with-config.html (설정 파일 사용)

```
http://localhost:8000/examples/with-config.html
```

**특징:**
- config.js 파일에서 API 키 로드
- 실제 프로젝트와 동일한 방식

**사용법:**
1. `examples/config.js` 파일에 API 키 입력
2. 서버 실행
3. 브라우저에서 열기

---

### 3. basic.html (전체 기능)

```
http://localhost:8000/examples/basic.html
```

**특징:**
- 기본 사용, 자동완성, 상세주소 없는 모드 등 모든 예제
- 여러 옵션 테스트

---

## 빠른 테스트 (Python 서버)

```bash
# 1. 프로젝트 폴더로 이동
cd "C:\Users\xfs50r\OneDrive - HellermannTyton\Desktop\Devguru\independent-address-kr"

# 2. 서버 실행
python -m http.server 8000

# 3. 브라우저 열기
start http://localhost:8000/examples/simple-test.html
```

**끝!** 주소 검색이 작동합니다! 🎉

---

## 문제 해결

### 에러: "Cannot use import statement outside a module"

**원인:** `file://` 프로토콜로 열었습니다.

**해결:** 위의 방법 중 하나로 로컬 서버를 실행하세요.

---

### 에러: "Failed to fetch"

**원인:** API 호출 실패

**해결:**
1. 인터넷 연결 확인
2. API 키 확인 (실제 키 사용 시)
3. 브라우저 개발자 도구(F12) 콘솔에서 에러 확인

---

### 검색 결과가 나오지 않음

**원인:** API 키가 올바르지 않거나 도메인 제한

**해결:**
1. `simple-test.html` 먼저 테스트 (테스트 키 내장)
2. 정상 작동하면 본인의 API 키 발급
3. https://business.juso.go.kr/ 에서 도메인 설정 확인

---

## 개발자 도구 활용

브라우저에서 F12를 눌러 개발자 도구를 열면:

### Console 탭
```
🚀 주소 검색 초기화 중...
✅ 주소 검색이 준비되었습니다!
선택된 주소: { roadAddress: "...", ... }
```

### Network 탭
- API 호출 확인
- 응답 데이터 확인

---

## 추천 테스트 시나리오

### 시나리오 1: 기본 테스트

```
1. simple-test.html 열기
2. "판교역로 235" 검색
3. 결과 클릭
4. 상세주소 "에이치스퀘어 7층" 입력
5. 완료!
```

### 시나리오 2: 자동완성 테스트

```
1. basic.html 열기 (자동완성 모드)
2. "강남구 테헤란로" 입력 시작
3. 타이핑하는 즉시 결과 표시 확인
```

### 시나리오 3: 본인 API 키 테스트

```
1. https://business.juso.go.kr/ 에서 API 키 발급
2. examples/config.js 파일에 키 입력
3. with-config.html 열기
4. 주소 검색 테스트
```

---

## 다음 단계

테스트가 성공하면:

1. ✅ 자신의 웹사이트에 적용
2. ✅ 폼과 연동
3. ✅ 스타일 커스터마이징
4. ✅ 백엔드와 연동

---

**Happy Testing!** 🚀
