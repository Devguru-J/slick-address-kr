# API 키 관리 가이드

웹사이트에서 주소 검색 기능을 사용할 때 API 키를 안전하게 관리하는 방법입니다.

---

## ⚠️ 중요: API 키 보안

**문제점:**
- 프론트엔드 코드에 API 키를 직접 넣으면 누구나 볼 수 있습니다
- 악의적인 사용자가 키를 복사하여 악용할 수 있습니다
- API 호출 제한을 초과할 수 있습니다

**해결책:**
프로젝트 규모와 상황에 맞는 방법을 선택하세요.

---

## 방법 1: 백엔드 프록시 서버 (⭐ 가장 안전, 추천)

API 키를 서버에만 저장하고, 클라이언트는 자체 서버를 통해 주소 API를 호출합니다.

### 장점
- ✅ API 키 완전 보호
- ✅ 요청 제한 관리 가능
- ✅ 로깅 및 모니터링 가능
- ✅ 악의적 사용 차단 가능

### 단점
- ❌ 백엔드 서버 필요
- ❌ 서버 관리 비용

### 구현 예제

#### Node.js + Express

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 환경 변수에서 API 키 로드 (.env 파일)
const JUSO_API_KEY = process.env.JUSO_API_KEY;

// 프록시 엔드포인트
app.get('/api/address/search', async (req, res) => {
  const { keyword, currentPage = 1, countPerPage = 10 } = req.query;

  // 입력 검증
  if (!keyword) {
    return res.status(400).json({ error: '검색어를 입력하세요' });
  }

  try {
    // 행정안전부 API 호출 (서버에서만 API 키 사용)
    const response = await axios.get('https://business.juso.go.kr/addrlink/addrLinkApi.do', {
      params: {
        confmKey: JUSO_API_KEY,
        currentPage,
        countPerPage,
        keyword,
        resultType: 'json',
      }
    });

    // 결과 반환
    res.json(response.data);
  } catch (error) {
    console.error('API 호출 오류:', error);
    res.status(500).json({ error: '주소 검색 중 오류가 발생했습니다' });
  }
});

app.listen(3000, () => {
  console.log('프록시 서버가 3000번 포트에서 실행 중입니다.');
});
```

#### .env 파일

```env
JUSO_API_KEY=your_actual_api_key_here
```

#### 클라이언트 코드 수정

```javascript
// api-client.ts 수정
export class AddressApiClient {
  private apiUrl = 'http://your-domain.com/api/address/search'; // 본인 서버 URL

  constructor(apiKey?: string) {
    // apiKey 파라미터는 사용하지 않음 (서버에서 관리)
  }

  async search(keyword: string, currentPage: number = 1, countPerPage: number = 10) {
    const params = new URLSearchParams({
      keyword: keyword.trim(),
      currentPage: currentPage.toString(),
      countPerPage: countPerPage.toString(),
    });

    const response = await fetch(`${this.apiUrl}?${params.toString()}`);
    const data = await response.json();

    return {
      results: data.results.juso.map(/* ... */),
      totalCount: parseInt(data.results.common.totalCount, 10),
    };
  }
}
```

---

## 방법 2: 환경 변수 사용 (빌드 시)

Webpack, Vite 등 번들러를 사용하여 빌드 시 API 키를 주입합니다.

### 장점
- ✅ 소스 코드에 하드코딩하지 않음
- ✅ 환경별로 다른 키 사용 가능
- ✅ 비교적 간단한 구현

### 단점
- ⚠️ 빌드된 파일에는 키가 포함됨
- ⚠️ 개발자 도구로 확인 가능
- ⚠️ 완전한 보안은 아님

### React (Create React App)

```bash
# .env 파일
REACT_APP_JUSO_API_KEY=your_api_key_here
```

```javascript
// App.js
const finder = new KoreanAddressFinder({
  apiKey: process.env.REACT_APP_JUSO_API_KEY,
  onSelect: (address) => console.log(address)
});
```

### Vue

```bash
# .env 파일
VUE_APP_JUSO_API_KEY=your_api_key_here
```

```javascript
// main.js
const finder = new KoreanAddressFinder({
  apiKey: process.env.VUE_APP_JUSO_API_KEY,
  onSelect: (address) => console.log(address)
});
```

### Vite

```bash
# .env 파일
VITE_JUSO_API_KEY=your_api_key_here
```

```javascript
const finder = new KoreanAddressFinder({
  apiKey: import.meta.env.VITE_JUSO_API_KEY,
  onSelect: (address) => console.log(address)
});
```

---

## 방법 3: 설정 파일 사용 (간단한 프로젝트용)

프로젝트 루트에 설정 파일을 만들고 .gitignore에 추가합니다.

### 장점
- ✅ 구현이 매우 간단
- ✅ 번들러 없이도 사용 가능

### 단점
- ⚠️ 배포 시 설정 파일 관리 필요
- ⚠️ 여전히 클라이언트에 노출됨

### 구현 예제

#### config.js (Git에 올리지 않음)

```javascript
// config.js
export const config = {
  jusoApiKey: 'your_actual_api_key_here'
};
```

#### config.example.js (Git에 올림, 템플릿)

```javascript
// config.example.js
export const config = {
  jusoApiKey: 'YOUR_API_KEY_HERE' // 이 파일을 config.js로 복사하고 실제 키를 입력하세요
};
```

#### .gitignore

```
config.js
.env
```

#### 사용 방법

```javascript
// main.js
import { config } from './config.js';
import { KoreanAddressFinder } from 'korean-address-finder';

const finder = new KoreanAddressFinder({
  apiKey: config.jusoApiKey,
  onSelect: (address) => console.log(address)
});

finder.init();
```

---

## 방법 4: 도메인 제한 (행정안전부 API 기능)

행정안전부 주소 API는 **승인 시 등록한 도메인에서만** 작동하도록 설정 가능합니다.

### 설정 방법

1. [주소기반산업지원서비스](https://business.juso.go.kr/) 로그인
2. 승인키 신청/관리
3. **사용 도메인 등록** (예: `https://yourdomain.com`)
4. 저장

### 장점
- ✅ 다른 도메인에서 키 악용 불가능
- ✅ 추가 코드 작업 불필요

### 단점
- ⚠️ localhost에서 테스트 시 별도 개발용 키 필요
- ⚠️ 도메인 변경 시 재등록 필요

---

## 권장 방법 (프로젝트별)

### 개인 프로젝트 / 작은 웹사이트
→ **방법 3 (설정 파일) + 방법 4 (도메인 제한)**

```javascript
// config.js (gitignore에 추가)
export const config = {
  jusoApiKey: 'devU01TX0FVVEgyMDI1MDExMDE1...'
};
```

### 중소 규모 프로젝트
→ **방법 2 (환경 변수) + 방법 4 (도메인 제한)**

```bash
# .env
REACT_APP_JUSO_API_KEY=your_key
```

### 대규모 / 상용 서비스
→ **방법 1 (백엔드 프록시) ⭐ 필수**

서버에서 API 키 관리, 요청 제한, 로깅 구현

---

## 실전 예제: 간단한 웹사이트

### 파일 구조

```
my-website/
├── index.html
├── config.js          # API 키 포함 (gitignore)
├── config.example.js  # 템플릿 (git에 포함)
├── main.js
└── .gitignore
```

### config.example.js

```javascript
export const config = {
  // 이 파일을 config.js로 복사하고 아래에 실제 API 키를 입력하세요
  // 발급 방법: https://business.juso.go.kr/
  jusoApiKey: 'YOUR_API_KEY_HERE'
};
```

### config.js (실제 사용, Git에 올리지 않음)

```javascript
export const config = {
  jusoApiKey: 'devU01TX0FVVEgyMDI1MDExMDE1MTY0MTExNTM2MjY='
};
```

### .gitignore

```
config.js
node_modules/
.env
```

### main.js

```javascript
import { config } from './config.js';
import { KoreanAddressFinder } from 'korean-address-finder';

const finder = new KoreanAddressFinder({
  apiKey: config.jusoApiKey,
  onSelect: (address) => {
    console.log('선택된 주소:', address);
  }
});

finder.init();
```

### 배포 시

1. 서버에 `config.js` 파일 직접 생성
2. 실제 API 키 입력
3. 파일 권한 설정 (읽기 전용)

---

## 보안 체크리스트

배포 전 확인:

- [ ] `.gitignore`에 `config.js`, `.env` 추가
- [ ] GitHub/GitLab에 실제 API 키 업로드 안 됨
- [ ] API 키에 도메인 제한 설정
- [ ] 가능하면 백엔드 프록시 사용
- [ ] 환경 변수는 빌드 서버에만 설정
- [ ] API 사용량 모니터링 설정

---

## 추가 보안 팁

### 1. API 사용량 제한

```javascript
// 간단한 Rate Limiting
let requestCount = 0;
let lastResetTime = Date.now();

async function searchWithLimit(keyword) {
  const now = Date.now();

  // 1분마다 리셋
  if (now - lastResetTime > 60000) {
    requestCount = 0;
    lastResetTime = now;
  }

  // 분당 10회 제한
  if (requestCount >= 10) {
    alert('너무 많은 요청입니다. 잠시 후 다시 시도하세요.');
    return;
  }

  requestCount++;
  return await apiClient.search(keyword);
}
```

### 2. 디바운싱으로 불필요한 요청 감소

```javascript
const finder = new KoreanAddressFinder({
  apiKey: config.jusoApiKey,
  autocompleteMode: true, // 자동으로 300ms 디바운싱 적용됨
});
```

---

## 문제 해결

### Q: API 키가 노출되면 어떻게 하나요?

1. 즉시 [주소기반산업지원서비스](https://business.juso.go.kr/)에서 키 재발급
2. 이전 키 비활성화
3. 새 키로 교체

### Q: localhost에서 테스트하려면?

1. 개발용 API 키 별도 발급
2. 도메인에 `localhost` 또는 `127.0.0.1` 등록
3. 또는 도메인 제한 없는 키 사용 (개발 시에만)

### Q: 여러 도메인에서 사용하려면?

- 도메인마다 별도 키 발급
- 또는 와일드카드 지원 여부 확인 (API 제공자에 문의)

---

## 마무리

**개인/소규모 프로젝트**: 설정 파일 + 도메인 제한으로 충분합니다.

**상용 서비스**: 반드시 백엔드 프록시를 구현하세요!

더 자세한 내용은 프로젝트의 `SECURITY.md` 파일을 참조하세요.
