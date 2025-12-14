# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-12-14

### Changed
- **패키지 매니저 호환성 개선**
  - README에 pnpm, bun, deno 설치 방법 추가
  - package.json keywords에 pnpm, bun, deno, keyboard-navigation 추가
  - 특징 섹션에 "모든 패키지 매니저 지원" 항목 추가
  - npm 검색 가능성 향상

### Documentation
- 설치 가이드 개선 (5가지 패키지 매니저 지원 명시)
- 검색 키워드 최적화

---

## [1.0.2] - 2025-12-14

### Added
- **키보드 네비게이션 기능** 🆕
  - 화살표 키(⬆️⬇️)로 검색 결과 탐색
  - Enter 키로 주소 선택 및 적용
  - ESC 키로 검색 결과 닫기
  - 마우스 없이 빠른 주소 입력 가능

- **백엔드 프록시 서버 예제** (`examples/backend-proxy/`)
  - API 키를 서버에서 안전하게 관리
  - localhost 테스트 시 도메인 제한 문제 해결
  - CORS 및 Rate Limiting 포함

- **향상된 예제 파일** (`examples/proxy-test.html`)
  - 자동완성 + 키보드 네비게이션 데모
  - 300ms 디바운싱 적용
  - 실시간 주소 검색 시연

### Changed
- README 업데이트
  - 키보드 네비게이션 사용법 추가
  - 백엔드 프록시 가이드 추가
  - 특징 섹션에 키보드 네비게이션 항목 추가

### Documentation
- API 키 관리 가이드 개선
- 테스트 가이드 업데이트
- 한국어 README (README.ko.md) 업데이트

---

## [1.0.1] - 2025-11-10

### Initial Release
- 팝업 없는 인라인 주소 검색 UI
- 자동완성 모드 지원
- TypeScript 지원
- 행정안전부 도로명주소 API 연동
- React, Vue 등 프레임워크 지원
- 반응형 디자인
- 커스터마이징 가능한 스타일

---

## 버전 히스토리

- **1.0.2** (2025-12-14): 키보드 네비게이션 + 백엔드 프록시 예제 추가
- **1.0.1** (2025-11-10): 초기 릴리스
