# Contributing to Korean Address Finder

이 프로젝트에 기여해주셔서 감사합니다!

## 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/yourusername/korean-address-finder.git
cd korean-address-finder

# 의존성 설치
npm install

# 개발 모드 실행 (watch 모드)
npm run dev

# 빌드
npm run build
```

## 개발 가이드

### 프로젝트 구조

```
korean-address-finder/
├── src/
│   ├── types.ts           # TypeScript 타입 정의
│   ├── api-client.ts      # API 클라이언트
│   ├── address-finder.ts  # 메인 컴포넌트
│   ├── index.ts           # 진입점
│   └── styles.css         # 스타일시트
├── examples/
│   ├── basic.html         # 기본 사용 예제
│   ├── react-example.jsx  # React 예제
│   └── vue-example.vue    # Vue 예제
├── dist/                  # 빌드 결과물
├── package.json
├── tsconfig.json
└── README.md
```

### 코딩 스타일

- TypeScript를 사용합니다
- ESLint 규칙을 따릅니다
- 모든 공개 API는 JSDoc 주석을 작성합니다
- 커밋 메시지는 conventional commits 형식을 따릅니다

### 커밋 메시지 형식

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 작업, 패키지 매니저 설정 등
```

## Pull Request 프로세스

1. 이슈를 먼저 생성하여 변경 사항을 논의합니다
2. Fork하고 feature 브랜치를 생성합니다
3. 변경 사항을 커밋합니다
4. 테스트를 추가/업데이트합니다
5. 문서를 업데이트합니다
6. PR을 생성합니다

## 버그 리포트

버그를 발견하셨나요? 다음 정보를 포함하여 이슈를 생성해주세요:

- 버그 설명
- 재현 방법
- 예상 동작
- 실제 동작
- 스크린샷 (가능한 경우)
- 환경 정보 (브라우저, OS 등)

## 기능 제안

새로운 기능을 제안하고 싶으시다면:

- 기능 설명
- 사용 사례
- 예상되는 이점
- 가능한 구현 방법

## 테스트

```bash
# 테스트 실행
npm test

# 커버리지 확인
npm run test:coverage
```

## 라이선스

기여하신 코드는 MIT 라이선스 하에 배포됩니다.
