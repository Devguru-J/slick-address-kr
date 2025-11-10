/**
 * Korean Address Finder - 실제 적용용
 *
 * 사용 방법:
 * 1. 이 파일을 프로젝트에 복사
 * 2. HTML에 포함: <script src="korean-address-finder.js"></script>
 * 3. config.js 파일에 API 키 입력
 * 4. 초기화 코드 실행
 */

(function(window) {
  'use strict';

  // API 설정
  const API_URL = 'https://business.juso.go.kr/addrlink/addrLinkApi.do';

  /**
   * 주소 검색 클래스
   */
  class KoreanAddressFinder {
    constructor(options = {}) {
      this.apiKey = options.apiKey || '';
      this.containerId = options.containerId || 'address-finder';
      this.onSelect = options.onSelect || function() {};
      this.countPerPage = options.countPerPage || 10;
      this.autocomplete = options.autocomplete !== false; // 기본값: true (자동완성 켜짐)
      this.minLength = options.minLength || 2; // 최소 검색 글자 수
      this.debounceTimer = null; // 디바운스 타이머

      if (!this.apiKey) {
        console.warn('⚠️ API 키가 설정되지 않았습니다. config.js 파일을 확인하세요.');
      }
    }

    /**
     * UI 초기화
     */
    init() {
      const container = document.getElementById(this.containerId);
      if (!container) {
        console.error(`❌ 컨테이너를 찾을 수 없습니다: #${this.containerId}`);
        return;
      }

      // HTML 구조 생성
      container.innerHTML = `
        <div class="kaf-wrapper">
          <div class="kaf-search-box">
            <input type="text" class="kaf-search-input" placeholder="주소를 입력하세요 (예: 판교역로 235)">
            <button type="button" class="kaf-search-btn">검색</button>
          </div>
          <div class="kaf-results" style="display: none;"></div>
          <div class="kaf-selected-address" style="display: none;"></div>
        </div>
      `;

      // CSS 적용
      this.injectStyles();

      // 이벤트 리스너 등록
      this.attachEvents(container);

      console.log('✅ Korean Address Finder 초기화 완료');
    }

    /**
     * 스타일 주입
     */
    injectStyles() {
      if (document.getElementById('kaf-styles')) return;

      const style = document.createElement('style');
      style.id = 'kaf-styles';
      style.textContent = `
        .kaf-wrapper {
          width: 100%;
          max-width: 600px;
          font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
        }

        .kaf-search-box {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .kaf-search-input {
          flex: 1;
          padding: 12px 16px;
          font-size: 14px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          outline: none;
        }

        .kaf-search-input:focus {
          border-color: #4a90e2;
        }

        .kaf-search-btn {
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          background-color: #4a90e2;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .kaf-search-btn:hover {
          background-color: #357abd;
        }

        .kaf-results {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          max-height: 400px;
          overflow-y: auto;
          background: white;
        }

        .kaf-result-item {
          padding: 16px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
        }

        .kaf-result-item:hover {
          background-color: #f8f9fa;
        }

        .kaf-result-item:last-child {
          border-bottom: none;
        }

        .kaf-result-type {
          display: inline-block;
          padding: 2px 8px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          background-color: #4a90e2;
          border-radius: 4px;
          margin-right: 8px;
        }

        .kaf-result-address {
          font-size: 14px;
          color: #333;
        }

        .kaf-result-zipcode {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .kaf-selected-address {
          margin-top: 16px;
          padding: 16px;
          background-color: #f0f8ff;
          border: 1px solid #4a90e2;
          border-radius: 8px;
        }

        .kaf-selected-address h3 {
          color: #4a90e2;
          margin: 0 0 10px 0;
          font-size: 16px;
        }

        .kaf-selected-address p {
          margin: 5px 0;
          font-size: 14px;
        }

        .kaf-loading, .kaf-error {
          text-align: center;
          padding: 20px;
        }

        .kaf-loading {
          color: #666;
        }

        .kaf-error {
          color: #e74c3c;
        }
      `;
      document.head.appendChild(style);
    }

    /**
     * 이벤트 리스너 등록
     */
    attachEvents(container) {
      const input = container.querySelector('.kaf-search-input');
      const button = container.querySelector('.kaf-search-btn');
      const resultsDiv = container.querySelector('.kaf-results');

      // 검색 버튼 클릭
      button.addEventListener('click', () => this.search(input.value));

      // 엔터키 검색
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.search(input.value);
        }
      });

      // 자동완성 기능
      if (this.autocomplete) {
        input.addEventListener('input', (e) => {
          const keyword = e.target.value.trim();

          // 최소 길이 체크
          if (keyword.length < this.minLength) {
            resultsDiv.style.display = 'none';
            return;
          }

          // 디바운스 적용 (300ms 대기)
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            this.search(keyword);
          }, 300);
        });

        // 포커스 시 결과 다시 표시
        input.addEventListener('focus', () => {
          if (resultsDiv.innerHTML && resultsDiv.innerHTML !== '<div class="kaf-loading">검색 중...</div>') {
            resultsDiv.style.display = 'block';
          }
        });

        // 외부 클릭 시 결과 닫기
        document.addEventListener('click', (e) => {
          if (!container.contains(e.target)) {
            resultsDiv.style.display = 'none';
          }
        });
      }
    }

    /**
     * 주소 검색
     */
    async search(keyword) {
      if (!keyword || keyword.trim().length === 0) {
        alert('검색어를 입력하세요');
        return;
      }

      const container = document.getElementById(this.containerId);
      const resultsDiv = container.querySelector('.kaf-results');

      resultsDiv.style.display = 'block';
      resultsDiv.innerHTML = '<div class="kaf-loading">검색 중...</div>';

      try {
        const params = new URLSearchParams({
          confmKey: this.apiKey,
          currentPage: '1',
          countPerPage: this.countPerPage.toString(),
          keyword: keyword.trim(),
          resultType: 'json'
        });

        const response = await fetch(`${API_URL}?${params.toString()}`);
        const data = await response.json();

        if (data.results.common.errorCode !== '0') {
          resultsDiv.innerHTML = `
            <div class="kaf-error">
              <strong>검색 오류:</strong><br>
              ${data.results.common.errorMessage}<br><br>
              <small>API 키를 확인하세요.</small>
            </div>
          `;
          return;
        }

        this.displayResults(data.results.juso, resultsDiv);

      } catch (error) {
        console.error('검색 오류:', error);
        resultsDiv.innerHTML = '<div class="kaf-error">검색 중 오류가 발생했습니다.</div>';
      }
    }

    /**
     * 결과 표시
     */
    displayResults(addresses, resultsDiv) {
      if (!addresses || addresses.length === 0) {
        resultsDiv.innerHTML = '<div class="kaf-error">검색 결과가 없습니다.</div>';
        return;
      }

      let html = '';
      addresses.forEach(addr => {
        html += `
          <div class="kaf-result-item" data-zipno="${addr.zipNo}" data-road="${addr.roadAddr}" data-jibun="${addr.jibunAddr}">
            <div>
              <span class="kaf-result-type">도로명</span>
              <span class="kaf-result-address">${addr.roadAddr}</span>
            </div>
            <div style="margin-top: 4px;">
              <span class="kaf-result-type" style="background-color: #999;">지번</span>
              <span class="kaf-result-address">${addr.jibunAddr}</span>
            </div>
            <div class="kaf-result-zipcode">우편번호: ${addr.zipNo}</div>
          </div>
        `;
      });

      resultsDiv.innerHTML = html;

      // 클릭 이벤트
      resultsDiv.querySelectorAll('.kaf-result-item').forEach(item => {
        item.addEventListener('click', () => {
          this.selectAddress({
            zipCode: item.dataset.zipno,
            roadAddress: item.dataset.road,
            jibunAddress: item.dataset.jibun
          });
        });
      });
    }

    /**
     * 주소 선택
     */
    selectAddress(address) {
      const container = document.getElementById(this.containerId);
      const selectedDiv = container.querySelector('.kaf-selected-address');
      const resultsDiv = container.querySelector('.kaf-results');

      selectedDiv.innerHTML = `
        <h3>✅ 선택된 주소</h3>
        <p><strong>우편번호:</strong> ${address.zipCode}</p>
        <p><strong>도로명 주소:</strong> ${address.roadAddress}</p>
        <p><strong>지번 주소:</strong> ${address.jibunAddress}</p>
      `;

      selectedDiv.style.display = 'block';
      resultsDiv.style.display = 'none';

      // 콜백 실행
      this.onSelect(address);

      console.log('선택된 주소:', address);
    }
  }

  // 전역으로 노출
  window.KoreanAddressFinder = KoreanAddressFinder;

})(window);
