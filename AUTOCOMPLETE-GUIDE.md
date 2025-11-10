# 자동완성 기능 가이드

다음 주소 API와 동일한 자동완성 기능이 추가되었습니다!

---

## ✨ 자동완성 기능이란?

타이핑하는 즉시 검색 결과가 나타나는 기능입니다.

### 다음 주소 API와 동일한 경험

- ✅ 2글자 이상 입력 시 자동 검색
- ✅ 300ms 디바운스 적용 (과도한 API 호출 방지)
- ✅ 입력 중지 시 자동으로 검색
- ✅ 검색 버튼 클릭 불필요
- ✅ 외부 클릭 시 결과 닫기

---

## 🚀 기본 사용 (자동완성 켜짐)

자동완성은 **기본적으로 활성화**되어 있습니다!

```javascript
const finder = new KoreanAddressFinder({
  containerId: 'address-finder',
  apiKey: window.CONFIG.jusoApiKey,
  // autocomplete는 기본값이 true
  onSelect: function(address) {
    console.log(address);
  }
});

finder.init();
```

### 작동 방식

1. **입력 시작**: "판교" 입력
2. **300ms 대기**: 더 입력할지 기다림
3. **자동 검색**: 추가 입력 없으면 자동으로 API 호출
4. **결과 표시**: 드롭다운으로 결과 표시
5. **선택**: 원하는 주소 클릭

---

## ⚙️ 옵션 설정

### 자동완성 끄기

```javascript
const finder = new KoreanAddressFinder({
  containerId: 'address-finder',
  apiKey: window.CONFIG.jusoApiKey,
  autocomplete: false,  // 자동완성 비활성화
  onSelect: function(address) {
    console.log(address);
  }
});

finder.init();
```

자동완성을 끄면:
- 검색 버튼을 클릭하거나
- 엔터키를 눌러야 검색됩니다

---

### 최소 검색 글자 수 변경

```javascript
const finder = new KoreanAddressFinder({
  containerId: 'address-finder',
  apiKey: window.CONFIG.jusoApiKey,
  minLength: 3,  // 3글자 이상부터 검색 (기본값: 2)
  onSelect: function(address) {
    console.log(address);
  }
});

finder.init();
```

---

### 디바운스 시간 조정

현재는 300ms로 고정되어 있습니다. 필요시 코드를 수정할 수 있습니다:

```javascript
// korean-address-finder.js 파일에서
setTimeout(() => {
  this.search(keyword);
}, 300);  // ← 이 값을 변경
```

**권장 값:**
- 빠른 응답: 200ms
- 기본: 300ms (권장)
- API 절약: 500ms

---

## 💡 사용 예제

### 예제 1: 기본 자동완성

```html
<div id="address-finder"></div>

<script src="config.js"></script>
<script src="korean-address-finder.js"></script>
<script>
  const finder = new KoreanAddressFinder({
    containerId: 'address-finder',
    apiKey: window.CONFIG.jusoApiKey,
    // 자동완성 기본 활성화
    onSelect: function(address) {
      console.log('선택:', address);
    }
  });

  finder.init();
</script>
```

**테스트:**
1. "판교역로" 입력 시작
2. "판교" 입력 후 잠시 대기
3. 자동으로 결과 표시!

---

### 예제 2: 폼과 연동

```html
<form id="address-form">
  <input type="text" id="zipcode" readonly placeholder="우편번호">
  <input type="text" id="address1" readonly placeholder="주소">
  <input type="text" id="address2" placeholder="상세주소">

  <!-- 자동완성 주소 검색 -->
  <div id="address-finder"></div>

  <button type="submit">저장</button>
</form>

<script src="config.js"></script>
<script src="korean-address-finder.js"></script>
<script>
  const finder = new KoreanAddressFinder({
    containerId: 'address-finder',
    apiKey: window.CONFIG.jusoApiKey,
    autocomplete: true,  // 자동완성
    onSelect: function(address) {
      // 폼에 자동 입력
      document.getElementById('zipcode').value = address.zipCode;
      document.getElementById('address1').value = address.roadAddress;
      document.getElementById('address2').focus(); // 상세주소로 포커스
    }
  });

  finder.init();
</script>
```

**사용자 경험:**
1. 주소 검색창에 "강남구 테헤" 입력
2. 자동으로 "강남구 테헤란로" 결과 표시
3. 원하는 주소 클릭
4. 우편번호, 주소가 자동으로 입력됨
5. 상세주소 입력만 하면 완료!

---

### 예제 3: 자동완성 비활성화 (수동 검색)

```javascript
const finder = new KoreanAddressFinder({
  containerId: 'address-finder',
  apiKey: window.CONFIG.jusoApiKey,
  autocomplete: false,  // 자동완성 끔
  onSelect: function(address) {
    console.log(address);
  }
});

finder.init();
```

**사용 방식:**
- 주소 입력 후 검색 버튼 클릭
- 또는 엔터키 입력
- 타이핑만으로는 검색 안 됨

---

## 🎯 자동완성 vs 수동 검색

### 자동완성 모드 (기본)

**장점:**
- ✅ 빠른 검색
- ✅ 편리한 사용자 경험
- ✅ 다음 주소 API와 동일한 느낌

**단점:**
- ⚠️ API 호출 횟수 증가
- ⚠️ 네트워크 트래픽 증가

**추천 대상:**
- 일반 웹사이트
- 사용자 경험 중시
- API 호출 제한이 넉넉한 경우

---

### 수동 검색 모드

**장점:**
- ✅ API 호출 최소화
- ✅ 네트워크 트래픽 절약
- ✅ 정확한 검색어로만 검색

**단점:**
- ⚠️ 버튼 클릭 또는 엔터 필요
- ⚠️ 다소 불편할 수 있음

**추천 대상:**
- 내부 시스템
- API 호출 제한이 있는 경우
- 트래픽 절약이 중요한 경우

---

## 🔧 성능 최적화

### 1. 디바운스 적용 (이미 적용됨)

타이핑이 완전히 멈춘 후 검색합니다.

```javascript
// 300ms 대기 후 검색
clearTimeout(this.debounceTimer);
this.debounceTimer = setTimeout(() => {
  this.search(keyword);
}, 300);
```

### 2. 최소 길이 체크 (이미 적용됨)

2글자 미만은 검색하지 않습니다.

```javascript
if (keyword.length < this.minLength) {
  resultsDiv.style.display = 'none';
  return;
}
```

### 3. 중복 검색 방지 (선택사항)

동일한 키워드는 다시 검색하지 않습니다.

```javascript
// korean-address-finder.js에 추가
constructor(options = {}) {
  // ...
  this.lastKeyword = ''; // 마지막 검색어
}

search(keyword) {
  // 중복 검색 방지
  if (keyword === this.lastKeyword) {
    return;
  }
  this.lastKeyword = keyword;

  // 검색 실행...
}
```

---

## 🎨 자동완성 UI 커스터마이징

### 결과 드롭다운 스타일 변경

```html
<style>
  /* 결과 목록 배경색 */
  .kaf-results {
    background-color: #ffffff !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  }

  /* 결과 항목 호버 */
  .kaf-result-item:hover {
    background-color: #e3f2fd !important;
  }

  /* 로딩 텍스트 */
  .kaf-loading {
    color: #4a90e2 !important;
  }
</style>
```

---

## 📱 모바일 최적화

자동완성은 모바일에서도 완벽하게 작동합니다!

- ✅ 터치 입력 지원
- ✅ 가상 키보드와 호환
- ✅ 스크롤 가능한 결과 목록
- ✅ 외부 터치로 닫기

---

## 🐛 문제 해결

### 자동완성이 너무 느려요

**해결책 1:** 디바운스 시간 줄이기
```javascript
// korean-address-finder.js 파일에서
setTimeout(() => {
  this.search(keyword);
}, 200);  // 300ms → 200ms
```

**해결책 2:** 최소 글자 수 늘리기
```javascript
const finder = new KoreanAddressFinder({
  minLength: 3,  // 2 → 3
  // ...
});
```

---

### 자동완성이 너무 자주 호출돼요

**해결책 1:** 디바운스 시간 늘리기
```javascript
setTimeout(() => {
  this.search(keyword);
}, 500);  // 300ms → 500ms
```

**해결책 2:** 자동완성 끄기
```javascript
const finder = new KoreanAddressFinder({
  autocomplete: false,
  // ...
});
```

---

### 결과가 안 닫혀요

**원인:** 외부 클릭 이벤트 충돌

**해결:** 다른 클릭 이벤트와 충돌하지 않도록 코드 확인

---

## 🎉 완성!

이제 다음 주소 API와 동일한 자동완성 기능을 사용할 수 있습니다!

**테스트해보세요:**

1. 브라우저에서 열기
   ```
   http://localhost:8000/index.html
   ```

2. 검색창에 입력 시작
   - "판교" 입력
   - 잠시 대기 (300ms)
   - 자동으로 결과 표시!

3. 원하는 주소 클릭

**완료!** 🚀

---

## 📚 추가 문서

- [기본 사용 가이드](./HOW-TO-USE.md)
- [API 키 관리](./API-KEY-GUIDE.md)
- [전체 문서](./README.md)
