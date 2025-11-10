/**
 * 설정 파일 템플릿
 *
 * 사용 방법:
 * 1. 이 파일을 config.js로 복사
 * 2. YOUR_API_KEY_HERE를 실제 API 키로 교체
 * 3. .gitignore에 config.js 추가 (이미 추가됨)
 *
 * API 키 발급:
 * https://business.juso.go.kr/ 에서 무료로 발급 가능
 */

export const config = {
  // 행정안전부 주소 API 키
  jusoApiKey: 'U01TX0FVVEgyMDI1MTExMDEwMTk1MzExNjQyMzI=',

  // 선택사항: 커스텀 API 서버 (자체 백엔드를 사용하는 경우)
  // customApiUrl: 'https://your-server.com/api/address/search',

  // 선택사항: 기본 검색 옵션
  options: {
    countPerPage: 10,      // 페이지당 결과 수
    autocompleteMode: true, // 자동완성 모드
    showDetailInput: true,  // 상세주소 입력 필드 표시
  }
};
