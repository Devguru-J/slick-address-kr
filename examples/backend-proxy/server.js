/**
 * 백엔드 프록시 서버 예제
 *
 * 이 서버는 클라이언트와 행정안전부 주소 API 사이에서 프록시 역할을 합니다.
 * API 키를 서버에만 저장하여 보안을 강화합니다.
 *
 * 설치:
 * npm install express cors dotenv axios
 *
 * 실행:
 * node server.js
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors()); // CORS 허용 (프로덕션에서는 특정 도메인만 허용)
app.use(express.json());

// 환경 변수에서 API 키 로드
const JUSO_API_KEY = process.env.JUSO_API_KEY;

if (!JUSO_API_KEY) {
  console.error('⚠️  JUSO_API_KEY가 설정되지 않았습니다!');
  console.error('   .env 파일에 JUSO_API_KEY=your_key_here 를 추가하세요.');
  process.exit(1);
}

// Rate Limiting (선택사항)
const requestCounts = new Map();
const RATE_LIMIT = 100; // IP당 시간당 최대 요청 수
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1시간

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  // 시간 창 리셋
  if (now > userRequests.resetTime) {
    userRequests.count = 0;
    userRequests.resetTime = now + RATE_LIMIT_WINDOW;
  }

  userRequests.count++;
  requestCounts.set(ip, userRequests);

  return userRequests.count <= RATE_LIMIT;
}

// 주소 검색 프록시 엔드포인트
app.get('/api/address/search', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress;

  // Rate Limiting 체크
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      error: '요청 한도를 초과했습니다. 잠시 후 다시 시도하세요.',
      retryAfter: 3600 // 초 단위
    });
  }

  const { keyword, currentPage = 1, countPerPage = 10 } = req.query;

  // 입력 검증
  if (!keyword || keyword.trim().length === 0) {
    return res.status(400).json({
      error: '검색어를 입력하세요'
    });
  }

  if (keyword.trim().length < 2) {
    return res.status(400).json({
      error: '검색어는 2글자 이상 입력하세요'
    });
  }

  try {
    console.log(`[${new Date().toISOString()}] 주소 검색: "${keyword}" (IP: ${clientIp})`);

    // 행정안전부 API 호출
    const response = await axios.get('https://business.juso.go.kr/addrlink/addrLinkApi.do', {
      params: {
        confmKey: JUSO_API_KEY,
        currentPage,
        countPerPage,
        keyword: keyword.trim(),
        resultType: 'json',
      },
      timeout: 5000 // 5초 타임아웃
    });

    // API 응답 검증
    if (!response.data || !response.data.results) {
      throw new Error('잘못된 API 응답');
    }

    const data = response.data;

    // API 에러 체크
    if (data.results.common.errorCode !== '0') {
      console.error('API 에러:', data.results.common.errorMessage);
      return res.status(500).json({
        error: '주소 검색 중 오류가 발생했습니다',
        message: data.results.common.errorMessage
      });
    }

    // 결과 반환
    res.json(data);

  } catch (error) {
    console.error('주소 검색 오류:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: '요청 시간이 초과되었습니다. 다시 시도하세요.'
      });
    }

    res.status(500).json({
      error: '주소 검색 중 오류가 발생했습니다'
    });
  }
});

// 헬스 체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 주소 검색 프록시 서버가 실행 중입니다!');
  console.log('');
  console.log(`   포트: ${PORT}`);
  console.log(`   API 엔드포인트: http://localhost:${PORT}/api/address/search`);
  console.log(`   헬스 체크: http://localhost:${PORT}/health`);
  console.log('');
  console.log('   테스트 URL:');
  console.log(`   http://localhost:${PORT}/api/address/search?keyword=판교역로`);
  console.log('');
});

// 종료 시그널 처리
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호 수신. 서버 종료 중...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT 신호 수신. 서버 종료 중...');
  process.exit(0);
});
