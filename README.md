# Slick Address KR

행정안전부 도로명주소 API 기반 팝업 없는 한국 주소 검색 라이브러리

Korean address search library using official road address API - No popup required

[![npm version](https://img.shields.io/npm/v/slick-address-kr.svg)](https://www.npmjs.com/package/slick-address-kr)
[![license](https://img.shields.io/npm/l/slick-address-kr.svg)](https://github.com/Devguru-J/slick-address-kr/blob/main/LICENSE)

## 특징

- ✨ **팝업 없는 인라인 UI**: 다음 주소 API처럼 새 창이 열리지 않습니다
- 🚀 **가벼운 용량**: 외부 의존성 없이 순수 TypeScript로 작성
- 📱 **반응형 디자인**: 모바일부터 데스크톱까지 완벽 지원
- 🎨 **커스터마이징 가능**: CSS로 쉽게 스타일 변경 가능
- ⚡ **자동완성 모드**: 타이핑하는 즉시 검색 결과 표시
- ⌨️ **키보드 네비게이션**: 화살표 키로 결과 선택, 엔터로 적용 - 마우스 없이 빠른 입력!
- 🔒 **TypeScript 지원**: 완전한 타입 정의 제공
- 🌐 **프레임워크 무관**: Vanilla JS, React, Vue 등 어디서나 사용 가능
- 📦 **모든 패키지 매니저 지원**: npm, yarn, pnpm, bun, deno 모두 호환

## 설치

### npm
```bash
npm install slick-address-kr
```

### yarn
```bash
yarn add slick-address-kr
```

### pnpm
```bash
pnpm add slick-address-kr
```

### bun
```bash
bun add slick-address-kr
```

### deno
```typescript
import { KoreanAddressFinder } from "npm:slick-address-kr@1.0.2";
```

## 빠른 시작

### 1. 기본 사용 (Vanilla JavaScript)

**간단한 방법:**

1. 프로젝트 폴더의 `examples/index.html` 파일을 참조하세요
2. 로컬 서버 실행:
   ```bash
   python -m http.server 8000
   ```
3. 브라우저에서 열기:
   ```
   http://localhost:8000/examples/
   ```

**코드 예제:** [examples/index.html](./examples/index.html)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>주소 검색</title>
</head>
<body>
  <div id="address-search"></div>

  <script type="module">
    // config.js에서 API 키 로드
    import { config } from './config.js';

    // 주소 검색 API 호출 함수
    async function searchAddress(keyword) {
      const response = await fetch(
        `https://business.juso.go.kr/addrlink/addrLinkApi.do?` +
        `confmKey=${config.jusoApiKey}&keyword=${keyword}&resultType=json`
      );
      const data = await response.json();
      return data.results.juso;
    }

    // 검색 UI 구현...
  </script>
</body>
</html>
```

### 2. React에서 사용

```jsx
import React, { useEffect, useRef } from 'react';
import { KoreanAddressFinder } from 'korean-address-finder';
import 'korean-address-finder/dist/styles.css';

function AddressInput() {
  const containerRef = useRef(null);
  const finderRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !finderRef.current) {
      finderRef.current = new KoreanAddressFinder({
        onSelect: (address) => {
          console.log('선택된 주소:', address);
        }
      });

      finderRef.current.init(containerRef.current);
    }

    return () => {
      if (finderRef.current) {
        finderRef.current.destroy();
      }
    };
  }, []);

  return <div ref={containerRef}></div>;
}
```

### 3. Vue에서 사용

```vue
<template>
  <div ref="addressContainer"></div>
</template>

<script>
import { KoreanAddressFinder } from 'korean-address-finder';
import 'korean-address-finder/dist/styles.css';

export default {
  mounted() {
    this.finder = new KoreanAddressFinder({
      onSelect: (address) => {
        console.log('선택된 주소:', address);
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

## API 문서

### Options

```typescript
interface AddressFinderOptions {
  /** 행정안전부 API 키 (선택사항) */
  apiKey?: string;

  /** 한 페이지에 표시할 결과 수 (기본값: 10) */
  countPerPage?: number;

  /** 현재 페이지 번호 (기본값: 1) */
  currentPage?: number;

  /** 검색 결과를 표시할 컨테이너 ID */
  containerId?: string;

  /** 주소 선택 시 콜백 함수 */
  onSelect?: (address: AddressResult) => void;

  /** 상세주소 입력 필드 표시 여부 (기본값: true) */
  showDetailInput?: boolean;

  /** 커스텀 스타일 클래스 */
  customClass?: string;

  /** 자동완성 모드 사용 여부 (기본값: false) */
  autocompleteMode?: boolean;
}
```

### AddressResult

```typescript
interface AddressResult {
  /** 도로명 주소 */
  roadAddress: string;

  /** 지번 주소 */
  jibunAddress: string;

  /** 우편번호 */
  zipCode: string;

  /** 건물명 */
  buildingName?: string;

  /** 상세 주소 */
  detailAddress?: string;

  /** 참고 항목 */
  extraAddress?: string;

  /** 시도명 */
  sido?: string;

  /** 시군구명 */
  sigungu?: string;

  /** 읍면동명 */
  bname?: string;
}
```

### Methods

#### `init(targetElement?: HTMLElement): void`

주소 검색 UI를 초기화합니다.

```javascript
const finder = new KoreanAddressFinder(options);
finder.init(); // containerId 사용
// 또는
finder.init(document.getElementById('my-container')); // 직접 엘리먼트 전달
```

#### `destroy(): void`

컴포넌트를 제거하고 이벤트 리스너를 정리합니다.

```javascript
finder.destroy();
```

#### `getSelectedAddress(): Object | null`

현재 선택된 주소 정보를 반환합니다.

```javascript
const selected = finder.getSelectedAddress();
console.log(selected); // { roadAddress, zipCode, detailAddress }
```

## 사용 예제

### 자동완성 모드

입력하는 즉시 검색 결과를 표시합니다.

```javascript
const finder = new KoreanAddressFinder({
  autocompleteMode: true,
  onSelect: (address) => {
    console.log(address);
  }
});

finder.init();
```

### 키보드 네비게이션 🆕

마우스 없이 키보드만으로 주소를 빠르게 입력할 수 있습니다!

**사용 방법:**
- **⬇️ 화살표 아래**: 다음 검색 결과로 이동
- **⬆️ 화살표 위**: 이전 검색 결과로 이동
- **Enter**: 선택된 주소를 폼에 적용
- **ESC**: 검색 결과 닫기

```javascript
// 자동완성 모드에서 키보드 네비게이션이 자동으로 활성화됩니다
const finder = new KoreanAddressFinder({
  autocompleteMode: true,  // 타이핑 시 자동 검색
  onSelect: (address) => {
    console.log('선택된 주소:', address);
    // 폼에 자동으로 입력됩니다
  }
});

finder.init();
```

**데모:** `examples/proxy-test.html`에서 키보드 네비게이션을 체험할 수 있습니다.

### 상세주소 입력 없이 사용

```javascript
const finder = new KoreanAddressFinder({
  showDetailInput: false,
  onSelect: (address) => {
    console.log(address);
  }
});

finder.init();
```

### 커스텀 스타일 적용

```javascript
const finder = new KoreanAddressFinder({
  customClass: 'my-custom-class',
  onSelect: (address) => {
    console.log(address);
  }
});

finder.init();
```

```css
.my-custom-class .kaf-search-btn {
  background-color: #ff6b6b;
}

.my-custom-class .kaf-search-input:focus {
  border-color: #ff6b6b;
}
```

## API 키 발급 및 관리

이 라이브러리는 행정안전부 주소기반산업지원서비스 API를 사용합니다.

### 1. API 키 발급

1. [주소기반산업지원서비스](https://business.juso.go.kr/) 접속
2. 승인키 신청
3. ⚠️ **중요: "검색 API" 선택** (팝업 API가 아님!)
4. 사용할 도메인 등록 (선택사항)

### 2. API 키 안전하게 사용하기

**⚠️ 중요: API 키를 코드에 직접 넣으면 누구나 볼 수 있습니다!**

프로젝트 규모에 맞는 방법을 선택하세요:

#### 방법 A: 설정 파일 사용 (간단한 프로젝트)

```javascript
// config.js (Git에 올리지 않음)
export const config = {
  jusoApiKey: 'your_actual_api_key_here'
};

// main.js
import { config } from './config.js';

const finder = new KoreanAddressFinder({
  apiKey: config.jusoApiKey,
  onSelect: (address) => console.log(address)
});
```

#### 방법 B: 환경 변수 사용 (React, Vue 등)

```bash
# .env
REACT_APP_JUSO_API_KEY=your_key_here
```

```javascript
const finder = new KoreanAddressFinder({
  apiKey: process.env.REACT_APP_JUSO_API_KEY,
  onSelect: (address) => console.log(address)
});
```

#### 방법 C: 백엔드 프록시 서버 (상용 서비스 ⭐ 추천)

API 키를 서버에만 저장하고 클라이언트는 자체 서버를 통해 API 호출:

```javascript
// 클라이언트에서는 apiKey 불필요
const finder = new KoreanAddressFinder({
  // 자체 서버 URL 설정 (api-client.ts 수정 필요)
  onSelect: (address) => console.log(address)
});
```

자세한 내용은 `API-KEY-GUIDE.md` 및 `examples/backend-proxy/` 참조

## 다음 주소 API와의 비교

| 기능 | Slick Address KR | 다음 주소 API |
|------|------------------|--------------|
| 팝업 | ❌ 없음 | ✅ 있음 (새 창) |
| 인라인 UI | ✅ 지원 | ❌ 미지원 |
| 커스터마이징 | ✅ 자유롭게 가능 | ⚠️ 제한적 |
| 자동완성 | ✅ 지원 | ✅ 지원 |
| 데이터 소스 | 행정안전부 공공 API | 다음 자체 DB |
| 의존성 | ✅ 독립적 | ⚠️ 다음 의존 |
| 모바일 최적화 | ✅ 완벽 지원 | ✅ 지원 |

## 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)
- iOS Safari (12+)
- Android Chrome (최신)

## 라이선스

MIT License - 자유롭게 사용하세요!

## 기여하기

이슈와 PR은 언제나 환영합니다!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 문제 해결

### CORS 에러가 발생해요

행정안전부 API는 CORS를 지원합니다. 만약 에러가 발생한다면:

1. API 키가 올바른지 확인
2. ⚠️ **중요: API 발급 시 "검색 API"로 발급받았는지 확인** (팝업 API가 아님!)
3. 도메인이 승인된 도메인인지 확인
4. HTTPS 사용 권장

### 검색 결과가 나오지 않아요

1. 인터넷 연결 확인
2. API 키가 올바른지 확인
3. ⚠️ **API 발급 시 "검색 API"로 선택했는지 확인**
4. 콘솔에서 에러 메시지 확인

## 지원

- 이슈: [GitHub Issues](https://github.com/Devguru-J/slick-address-kr/issues)
- GitHub: [@Devguru-J](https://github.com/Devguru-J)

---

**Project tango down by Devguru-J**
