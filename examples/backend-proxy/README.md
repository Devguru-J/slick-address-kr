# 백엔드 프록시 서버

Korean Address Finder를 위한 백엔드 프록시 서버입니다.

## 왜 프록시 서버가 필요한가요?

- ✅ **API 키 보호**: 클라이언트에 API 키 노출 방지
- ✅ **요청 제한**: Rate Limiting으로 악의적 사용 차단
- ✅ **모니터링**: 로깅 및 사용량 추적
- ✅ **보안**: 입력 검증 및 에러 처리

## 설치

```bash
cd examples/backend-proxy
npm install
```

## 설정

1. `.env.example` 파일을 `.env`로 복사
2. `.env` 파일에 실제 API 키 입력

```bash
cp .env.example .env
```

`.env` 파일:
```env
JUSO_API_KEY=your_actual_api_key_here
PORT=3000
```

## 실행

### 개발 모드 (자동 재시작)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

## API 사용

### 주소 검색

**요청:**
```
GET http://localhost:3000/api/address/search?keyword=판교역로
```

**파라미터:**
- `keyword` (필수): 검색할 주소
- `currentPage` (선택): 페이지 번호 (기본값: 1)
- `countPerPage` (선택): 페이지당 결과 수 (기본값: 10)

**응답 예제:**
```json
{
  "results": {
    "common": {
      "totalCount": "100",
      "currentPage": "1",
      "countPerPage": "10",
      "errorCode": "0",
      "errorMessage": "정상"
    },
    "juso": [
      {
        "roadAddr": "경기도 성남시 분당구 판교역로 235",
        "jibunAddr": "경기도 성남시 분당구 삼평동 681",
        "zipNo": "13494",
        ...
      }
    ]
  }
}
```

## 클라이언트 연동

### api-client.ts 수정

```typescript
export class AddressApiClient {
  private apiUrl = 'http://localhost:3000/api/address/search';

  constructor(apiKey?: string) {
    // apiKey는 사용하지 않음 (서버에서 관리)
  }

  async search(keyword: string, currentPage: number = 1, countPerPage: number = 10) {
    const params = new URLSearchParams({
      keyword: keyword.trim(),
      currentPage: currentPage.toString(),
      countPerPage: countPerPage.toString(),
    });

    const response = await fetch(`${this.apiUrl}?${params.toString()}`);
    const data = await response.json();

    // 에러 처리
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      results: data.results.juso.map(/* ... */),
      totalCount: parseInt(data.results.common.totalCount, 10),
    };
  }
}
```

### HTML에서 사용

```html
<script type="module">
  import { KoreanAddressFinder } from 'korean-address-finder';

  const finder = new KoreanAddressFinder({
    // apiKey 불필요 (서버에서 관리)
    onSelect: (address) => {
      console.log(address);
    }
  });

  finder.init();
</script>
```

## 프로덕션 배포

### 1. Heroku

```bash
# Heroku CLI 설치 후
heroku create my-address-proxy
heroku config:set JUSO_API_KEY=your_key_here
git push heroku main
```

### 2. AWS EC2

```bash
# EC2 인스턴스에 접속 후
git clone https://github.com/your-repo/korean-address-finder.git
cd korean-address-finder/examples/backend-proxy
npm install
npm install -g pm2

# .env 파일 생성 및 API 키 입력
nano .env

# PM2로 서버 시작
pm2 start server.js --name address-proxy
pm2 save
pm2 startup
```

### 3. Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t address-proxy .
docker run -p 3000:3000 -e JUSO_API_KEY=your_key address-proxy
```

## CORS 설정

프로덕션에서는 특정 도메인만 허용하도록 설정:

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

## Rate Limiting

현재 설정:
- IP당 시간당 100회 요청 제한

변경하려면 `server.js`에서 수정:

```javascript
const RATE_LIMIT = 100;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
```

## 로깅

모든 요청이 콘솔에 로깅됩니다:

```
[2025-01-10T12:34:56.789Z] 주소 검색: "판교역로" (IP: ::1)
```

프로덕션에서는 Winston 등을 사용하여 파일로 저장 권장

## 모니터링

헬스 체크 엔드포인트:

```bash
curl http://localhost:3000/health
```

응답:
```json
{
  "status": "ok",
  "timestamp": "2025-01-10T12:34:56.789Z",
  "uptime": 12345.67
}
```

## 문제 해결

### 포트가 이미 사용 중

```bash
# 다른 포트 사용
PORT=3001 npm start
```

### API 키 에러

`.env` 파일 확인:
```bash
cat .env
```

## 라이선스

MIT
