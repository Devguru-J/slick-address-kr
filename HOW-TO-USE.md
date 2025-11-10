# 실제 적용 가이드

Korean Address Finder를 실제 웹사이트에 적용하는 방법입니다.

---

## 📦 필요한 파일 (3개만!)

### 1. korean-address-finder.js ⭐
- 주소 검색 라이브러리 (모든 기능 포함)
- 프로젝트 루트에 있음

### 2. config.js ⭐
- API 키 설정 파일
- **여기에 API 키를 입력합니다!**
- Git에 올리지 말 것 (.gitignore에 추가됨)

### 3. index.html (또는 본인의 HTML 파일)
- 주소 검색 기능을 사용할 페이지

---

## 🚀 적용 방법

### 1단계: 파일 복사

프로젝트 폴더에 다음 파일들을 복사:

```
your-project/
├── korean-address-finder.js    ← 복사
├── config.js                    ← 복사
└── index.html                   ← 본인의 HTML 파일
```

### 2단계: HTML에 스크립트 추가

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>내 웹사이트</title>
</head>
<body>

  <!-- 주소 검색이 표시될 위치 -->
  <div id="address-finder"></div>

  <!-- 1. config.js 로드 (API 키) -->
  <script src="config.js"></script>

  <!-- 2. 라이브러리 로드 -->
  <script src="korean-address-finder.js"></script>

  <!-- 3. 초기화 -->
  <script>
    const finder = new KoreanAddressFinder({
      containerId: 'address-finder',
      apiKey: window.CONFIG.jusoApiKey,
      onSelect: function(address) {
        console.log('선택된 주소:', address);
        // 주소 선택 시 처리
      }
    });

    finder.init();
  </script>
</body>
</html>
```

### 3단계: API 키 입력 ⭐ 중요!

**config.js 파일 열기:**

```javascript
window.CONFIG = {
  jusoApiKey: 'YOUR_API_KEY_HERE'  // ← 여기에 발급받은 키 입력!
};
```

**API 키 발급 방법:**

1. https://business.juso.go.kr/ 접속
2. 회원가입 후 로그인
3. "승인키 신청" 클릭
4. **"검색 API"** 선택 (⚠️ 팝업 API 아님!)
5. 도메인: 본인의 도메인 입력 (또는 공란)
6. 즉시 발급됨!

발급받은 키 예시:
```
devU01TX0FVVEgyMDI1MDExMDEwMTk1MzExNjQyMzI=
```

**config.js에 입력:**
```javascript
window.CONFIG = {
  jusoApiKey: 'devU01TX0FVVEgyMDI1MDExMDEwMTk1MzExNjQyMzI='
};
```

### 4단계: 테스트

로컬 서버 실행:
```bash
python -m http.server 8000
```

브라우저에서 열기:
```
http://localhost:8000/index.html
```

---

## 💡 폼과 연동 예제

### 배송지 입력 폼

```html
<form id="delivery-form">
  <div>
    <label>우편번호</label>
    <input type="text" id="zipcode" readonly>
  </div>

  <div>
    <label>주소</label>
    <input type="text" id="address1" readonly>
  </div>

  <div>
    <label>상세주소</label>
    <input type="text" id="address2">
  </div>

  <!-- 주소 검색 -->
  <div id="address-finder"></div>

  <button type="submit">주문하기</button>
</form>

<script src="config.js"></script>
<script src="korean-address-finder.js"></script>
<script>
  const finder = new KoreanAddressFinder({
    containerId: 'address-finder',
    apiKey: window.CONFIG.jusoApiKey,
    onSelect: function(address) {
      // 폼 필드에 자동 입력
      document.getElementById('zipcode').value = address.zipCode;
      document.getElementById('address1').value = address.roadAddress;
      document.getElementById('address2').focus(); // 상세주소로 포커스
    }
  });

  finder.init();

  // 폼 제출
  document.getElementById('delivery-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
      zipcode: document.getElementById('zipcode').value,
      address1: document.getElementById('address1').value,
      address2: document.getElementById('address2').value
    };

    console.log('배송 정보:', data);
    // 서버로 전송
  });
</script>
```

---

## 📁 실제 프로젝트 구조

### 간단한 프로젝트

```
my-website/
├── index.html
├── korean-address-finder.js
├── config.js                    # Git에 올리지 말 것!
└── config.example.js            # 템플릿 (Git에 포함)
```

### 복잡한 프로젝트

```
my-website/
├── assets/
│   ├── js/
│   │   ├── korean-address-finder.js
│   │   └── config.js           # Git에 올리지 말 것!
│   └── css/
├── index.html
└── order.html
```

HTML에서:
```html
<script src="assets/js/config.js"></script>
<script src="assets/js/korean-address-finder.js"></script>
```

---

## 🔧 옵션 설정

```javascript
const finder = new KoreanAddressFinder({
  // 필수: 컨테이너 ID
  containerId: 'address-finder',

  // 필수: API 키
  apiKey: window.CONFIG.jusoApiKey,

  // 선택: 주소 선택 시 콜백
  onSelect: function(address) {
    console.log(address);
  },

  // 선택: 페이지당 결과 수 (기본: 10)
  countPerPage: 10
});

finder.init();
```

### 콜백 함수에서 받는 데이터

```javascript
{
  zipCode: "13494",
  roadAddress: "경기도 성남시 분당구 판교역로 235",
  jibunAddress: "경기도 성남시 분당구 삼평동 681"
}
```

---

## 🎨 스타일 커스터마이징

### CSS 클래스

라이브러리는 다음 CSS 클래스를 사용합니다:

- `.kaf-wrapper` - 전체 래퍼
- `.kaf-search-box` - 검색 박스
- `.kaf-search-input` - 검색 입력창
- `.kaf-search-btn` - 검색 버튼
- `.kaf-results` - 결과 목록
- `.kaf-result-item` - 결과 항목
- `.kaf-selected-address` - 선택된 주소

### 커스텀 스타일 적용

HTML에 추가:
```html
<style>
  /* 검색 버튼 색상 변경 */
  .kaf-search-btn {
    background-color: #ff6b6b !important;
  }

  /* 결과 항목 호버 색상 */
  .kaf-result-item:hover {
    background-color: #e3f2fd !important;
  }

  /* 선택된 주소 배경색 */
  .kaf-selected-address {
    background-color: #fff3cd !important;
    border-color: #ffc107 !important;
  }
</style>
```

---

## ⚠️ 주의사항

### 1. config.js는 Git에 올리지 마세요!

**.gitignore에 추가:**
```
config.js
```

### 2. config.example.js는 Git에 포함

템플릿 파일은 공유하세요:
```javascript
// config.example.js
window.CONFIG = {
  jusoApiKey: 'YOUR_API_KEY_HERE'  // 설명용
};
```

### 3. 로컬 서버 필요

파일을 직접 더블클릭하면 안 됩니다!
```bash
# 로컬 서버 실행
python -m http.server 8000
```

### 4. API 키 종류 확인

- ✅ **검색 API** 키 사용
- ❌ 팝업 API 키는 사용 불가

---

## 🚀 배포 시

### 1. config.js 서버에 생성

```bash
# 서버에 직접 config.js 생성
nano config.js
```

### 2. 환경 변수 사용 (권장)

서버 환경 변수에 API 키 저장:
```bash
export JUSO_API_KEY=your_key_here
```

PHP 예제:
```php
<script>
window.CONFIG = {
  jusoApiKey: '<?php echo getenv('JUSO_API_KEY'); ?>'
};
</script>
```

### 3. 파일 권한 설정

```bash
chmod 600 config.js  # 읽기/쓰기만 허용
```

---

## 🐛 문제 해결

### "승인되지 않은 KEY" 에러

**원인:** 팝업 API 키를 사용했거나 잘못된 키

**해결:**
1. 검색 API 키인지 확인
2. 새로 발급받기
3. config.js에 정확히 입력

### 검색 기능이 안 보임

**원인:** 스크립트 로딩 순서 문제

**해결:**
```html
<!-- 순서 중요! -->
<script src="config.js"></script>           <!-- 1 -->
<script src="korean-address-finder.js"></script>  <!-- 2 -->
<script>
  // 3. 초기화
  const finder = new KoreanAddressFinder({...});
  finder.init();
</script>
```

### 콘솔 에러 확인

F12 → Console 탭:
```
✅ Korean Address Finder 초기화 완료
```

---

## 📝 체크리스트

배포 전 확인:

- [ ] `korean-address-finder.js` 파일 포함
- [ ] `config.js` 파일 생성
- [ ] API 키 정확히 입력
- [ ] `.gitignore`에 `config.js` 추가
- [ ] 로컬 서버에서 테스트 완료
- [ ] 주소 검색 정상 작동 확인
- [ ] 폼 연동 테스트 완료

---

## 📚 추가 문서

- [API 키 관리 가이드](./API-KEY-GUIDE.md)
- [백엔드 프록시 서버](./examples/backend-proxy/README.md)
- [전체 문서](./README.md)

---

**3개 파일만 있으면 됩니다!**

1. `korean-address-finder.js` - 라이브러리
2. `config.js` - API 키 설정
3. `index.html` - 사용할 페이지

**끝!** 🎉
