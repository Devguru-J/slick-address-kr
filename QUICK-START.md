# 빠른 시작 가이드

Korean Address Finder를 5분 안에 웹사이트에 적용하는 방법입니다.

---

## 1단계: 설치

### npm 사용
```bash
npm install korean-address-finder
```

### CDN 사용 (npm 없이)
```html
<!-- 아직 npm 배포 전이므로 로컬 파일 사용 -->
<link rel="stylesheet" href="path/to/korean-address-finder/dist/styles.css">
<script type="module" src="path/to/korean-address-finder/dist/index.js"></script>
```

---

## 2단계: API 키 발급

1. [주소기반산업지원서비스](https://business.juso.go.kr/) 접속
2. 회원가입 후 로그인
3. **승인키 신청** 클릭
4. 사용할 도메인 입력 (예: `https://yourdomain.com`)
5. 즉시 발급 (무료!)

발급된 키 예시: `devU01TX0FVVEgyMDI1...`

---

## 3단계: 설정 파일 만들기

### config.js 파일 생성

```javascript
// config.js
export const config = {
  jusoApiKey: 'devU01TX0FVVEgyMDI1...' // 발급받은 실제 키 입력
};
```

**⚠️ 중요:** `.gitignore`에 `config.js` 추가!

```
# .gitignore
config.js
```

---

## 4단계: HTML에 적용

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>주소 검색</title>

  <!-- 스타일시트 -->
  <link rel="stylesheet" href="node_modules/korean-address-finder/dist/styles.css">
</head>
<body>
  <!-- 주소 검색 컨테이너 -->
  <div id="address-finder-container"></div>

  <!-- 스크립트 -->
  <script type="module">
    import { config } from './config.js';
    import { KoreanAddressFinder } from './node_modules/korean-address-finder/dist/index.js';

    const finder = new KoreanAddressFinder({
      containerId: 'address-finder-container',
      apiKey: config.jusoApiKey,
      onSelect: (address) => {
        // 주소가 선택되면 실행
        console.log('선택된 주소:', address);

        // 폼에 값 채우기 예제
        document.getElementById('zipcode').value = address.zipCode;
        document.getElementById('address1').value = address.roadAddress;
        document.getElementById('address2').value = address.detailAddress;
      }
    });

    finder.init();
  </script>
</body>
</html>
```

---

## 5단계: 폼과 연결

```html
<form id="delivery-form">
  <!-- 우편번호 -->
  <div>
    <label>우편번호</label>
    <input type="text" id="zipcode" readonly>
  </div>

  <!-- 기본 주소 -->
  <div>
    <label>주소</label>
    <input type="text" id="address1" readonly>
  </div>

  <!-- 상세 주소 -->
  <div>
    <label>상세주소</label>
    <input type="text" id="address2">
  </div>

  <!-- 주소 검색 -->
  <div id="address-finder-container"></div>

  <button type="submit">주문하기</button>
</form>

<script type="module">
  import { config } from './config.js';
  import { KoreanAddressFinder } from 'korean-address-finder';

  const finder = new KoreanAddressFinder({
    apiKey: config.jusoApiKey,
    onSelect: (address) => {
      // 폼 필드에 자동 입력
      document.getElementById('zipcode').value = address.zipCode;
      document.getElementById('address1').value = address.roadAddress;
      document.getElementById('address2').focus(); // 상세주소 입력으로 포커스
    }
  });

  finder.init();

  // 폼 제출 시
  document.getElementById('delivery-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
      zipcode: document.getElementById('zipcode').value,
      address1: document.getElementById('address1').value,
      address2: document.getElementById('address2').value
    };

    console.log('배송 정보:', formData);
    // 여기서 서버로 전송
  });
</script>
```

---

## React에서 사용

### 1. 설치
```bash
npm install korean-address-finder
```

### 2. 컴포넌트 생성

```jsx
// AddressInput.jsx
import React, { useEffect, useRef, useState } from 'react';
import { KoreanAddressFinder } from 'korean-address-finder';
import 'korean-address-finder/dist/styles.css';

function AddressInput({ onAddressSelect }) {
  const containerRef = useRef(null);
  const finderRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !finderRef.current) {
      finderRef.current = new KoreanAddressFinder({
        apiKey: process.env.REACT_APP_JUSO_API_KEY, // .env 파일에서
        onSelect: (address) => {
          onAddressSelect(address);
        }
      });

      finderRef.current.init(containerRef.current);
    }

    return () => {
      if (finderRef.current) {
        finderRef.current.destroy();
      }
    };
  }, [onAddressSelect]);

  return <div ref={containerRef}></div>;
}

export default AddressInput;
```

### 3. 사용

```jsx
// App.jsx
import AddressInput from './AddressInput';

function App() {
  const [address, setAddress] = useState(null);

  return (
    <div>
      <h1>배송지 입력</h1>

      <AddressInput onAddressSelect={setAddress} />

      {address && (
        <div>
          <p>우편번호: {address.zipCode}</p>
          <p>주소: {address.roadAddress}</p>
          <p>상세주소: {address.detailAddress}</p>
        </div>
      )}
    </div>
  );
}
```

### 4. .env 파일

```env
REACT_APP_JUSO_API_KEY=your_api_key_here
```

---

## Vue에서 사용

### 1. 컴포넌트 생성

```vue
<!-- AddressInput.vue -->
<template>
  <div ref="addressContainer"></div>
</template>

<script>
import { KoreanAddressFinder } from 'korean-address-finder';
import 'korean-address-finder/dist/styles.css';

export default {
  name: 'AddressInput',
  emits: ['select'],

  mounted() {
    this.finder = new KoreanAddressFinder({
      apiKey: process.env.VUE_APP_JUSO_API_KEY,
      onSelect: (address) => {
        this.$emit('select', address);
      }
    });

    this.finder.init(this.$refs.addressContainer);
  },

  beforeUnmount() {
    if (this.finder) {
      this.finder.destroy();
    }
  }
};
</script>
```

### 2. 사용

```vue
<template>
  <div>
    <h1>배송지 입력</h1>
    <AddressInput @select="handleAddressSelect" />

    <div v-if="address">
      <p>우편번호: {{ address.zipCode }}</p>
      <p>주소: {{ address.roadAddress }}</p>
    </div>
  </div>
</template>

<script>
import AddressInput from './components/AddressInput.vue';

export default {
  components: { AddressInput },
  data() {
    return {
      address: null
    };
  },
  methods: {
    handleAddressSelect(address) {
      this.address = address;
    }
  }
};
</script>
```

---

## 옵션 설정

### 자동완성 모드

타이핑하는 즉시 검색 (검색 버튼 불필요):

```javascript
const finder = new KoreanAddressFinder({
  apiKey: config.jusoApiKey,
  autocompleteMode: true, // 자동완성 활성화
  onSelect: (address) => console.log(address)
});
```

### 상세주소 입력 숨기기

주소만 필요하고 상세주소가 불필요한 경우:

```javascript
const finder = new KoreanAddressFinder({
  apiKey: config.jusoApiKey,
  showDetailInput: false, // 상세주소 입력 숨김
  onSelect: (address) => console.log(address)
});
```

### 페이지당 결과 수 변경

```javascript
const finder = new KoreanAddressFinder({
  apiKey: config.jusoApiKey,
  countPerPage: 20, // 기본값 10
  onSelect: (address) => console.log(address)
});
```

---

## 문제 해결

### API 키 에러

```
Error: API key is invalid
```

**해결:**
- API 키가 올바른지 확인
- 도메인이 승인된 도메인인지 확인
- [주소기반산업지원서비스](https://business.juso.go.kr/)에서 키 상태 확인

### CORS 에러

```
Access to fetch has been blocked by CORS policy
```

**해결:**
- 행정안전부 API는 CORS를 지원합니다
- 브라우저에서 직접 실행 (file:// 프로토콜 사용 X)
- 로컬 개발 서버 사용 (예: `npx serve`)

### 모듈을 찾을 수 없음

```
Cannot find module 'korean-address-finder'
```

**해결:**
```bash
npm install korean-address-finder
```

---

## 다음 단계

- [API 키 안전하게 관리하기](./API-KEY-GUIDE.md)
- [백엔드 프록시 서버 구축](./examples/backend-proxy/)
- [독립 데이터베이스 구축](./SELF-HOSTED-DATABASE.md)
- [전체 문서 보기](./README.md)

---

## 지원

문제가 있으신가요?

- [GitHub Issues](https://github.com/yourusername/korean-address-finder/issues)
- [문서](./README.md)

---

**5분 만에 완료!** 🎉

이제 웹사이트에 주소 검색 기능이 추가되었습니다!
