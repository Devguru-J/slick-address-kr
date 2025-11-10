# 사용 예제

Korean Address Finder를 다양한 방식으로 사용하는 예제들입니다.

---

## 📂 파일 목록

### 1. index.html ⭐ (메인 예제)

**설명:** config.js 파일에서 API 키를 로드하여 주소 검색 기능을 제공합니다.

**실행 방법:**
```bash
# 로컬 서버 실행
cd "프로젝트폴더"
python -m http.server 8000

# 브라우저에서 열기
http://localhost:8000/examples/
```

**특징:**
- ✅ config.js에서 API 키 자동 로드
- ✅ 설정 파일이 없어도 테스트 키로 작동
- ✅ API 키 상태 표시
- ✅ 완전한 주소 검색 기능

**API 키 설정:**
1. `config.example.js`를 `config.js`로 복사
2. API 키 입력
3. 페이지 새로고침

---

### 2. config.example.js (템플릿)

**설명:** API 키 설정 파일 템플릿

**사용 방법:**
```bash
# 복사
cp config.example.js config.js

# 편집 (메모장 또는 VS Code)
notepad config.js
```

**내용:**
```javascript
export const config = {
  jusoApiKey: 'YOUR_API_KEY_HERE', // 여기에 발급받은 키 입력
  options: {
    countPerPage: 10,
    autocompleteMode: true,
    showDetailInput: true,
  }
};
```

---

### 3. React 예제 (react-example.jsx)

**설명:** React 컴포넌트에서 주소 검색 사용 예제

**주요 코드:**
```jsx
import { KoreanAddressFinder } from 'korean-address-finder';

function AddressInput() {
  const containerRef = useRef(null);

  useEffect(() => {
    const finder = new KoreanAddressFinder({
      apiKey: process.env.REACT_APP_JUSO_API_KEY,
      onSelect: (address) => console.log(address)
    });

    finder.init(containerRef.current);

    return () => finder.destroy();
  }, []);

  return <div ref={containerRef}></div>;
}
```

---

### 4. Vue 예제 (vue-example.vue)

**설명:** Vue 컴포넌트에서 주소 검색 사용 예제

**주요 코드:**
```vue
<template>
  <div ref="addressContainer"></div>
</template>

<script>
import { KoreanAddressFinder } from 'korean-address-finder';

export default {
  mounted() {
    this.finder = new KoreanAddressFinder({
      apiKey: process.env.VUE_APP_JUSO_API_KEY,
      onSelect: (address) => this.$emit('select', address)
    });

    this.finder.init(this.$refs.addressContainer);
  },

  beforeUnmount() {
    if (this.finder) this.finder.destroy();
  }
};
</script>
```

---

### 5. backend-proxy/ (백엔드 프록시 서버)

**설명:** API 키를 서버에서 관리하는 방식 (가장 안전)

**실행 방법:**
```bash
cd backend-proxy
npm install
cp .env.example .env
# .env 파일에 API 키 입력
npm start
```

**자세한 내용:** [backend-proxy/README.md](./backend-proxy/README.md)

---

## 🚀 빠른 시작

### 1. 로컬 서버 실행

```bash
# Python 서버
python -m http.server 8000

# 또는 Node.js
npx http-server -p 8000
```

### 2. 브라우저 열기

```
http://localhost:8000/examples/
```

### 3. API 키 설정 (선택사항)

테스트 키가 내장되어 있어 바로 테스트 가능합니다.

실제 서비스에서는:
1. https://business.juso.go.kr/ 에서 **검색 API** 키 발급
2. `config.js` 파일에 입력
3. 페이지 새로고침

---

## 📝 테스트 주소

- `판교역로 235`
- `강남구 테헤란로 152`
- `여의도동`
- `서울 중구 세종대로 110`

---

## 🔧 문제 해결

### "승인되지 않은 KEY" 에러

**원인:** 팝업 API 키를 사용했거나 잘못된 키

**해결:**
1. https://business.juso.go.kr/ 접속
2. **검색 API** 키 발급 (팝업 API 아님!)
3. config.js에 입력

### 검색 결과가 안 나옴

**원인:** API 호출 실패

**해결:**
1. F12 → Console 탭에서 에러 확인
2. 인터넷 연결 확인
3. API 키 확인

### 파일을 직접 열면 안 됨

**원인:** 브라우저 CORS 정책

**해결:**
- 반드시 로컬 서버로 실행
- `python -m http.server 8000`

---

## 📚 추가 문서

- [빠른 시작 가이드](../QUICK-START.md)
- [API 키 관리 가이드](../API-KEY-GUIDE.md)
- [전체 문서](../README.md)

---

## 💡 팁

1. **개발 중**: 테스트 키 사용
2. **배포 전**: 본인의 API 키 발급
3. **상용 서비스**: 백엔드 프록시 서버 사용 추천

---

문의: GitHub Issues
