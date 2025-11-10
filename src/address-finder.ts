import { AddressApiClient } from './api-client';
import { AddressFinderOptions, AddressResult } from './types';

/**
 * 주소 검색 컴포넌트
 * 팝업 없이 인라인으로 주소를 검색하고 선택할 수 있는 UI를 제공합니다.
 */
export class KoreanAddressFinder {
  private apiClient: AddressApiClient;
  private options: Required<AddressFinderOptions>;
  private container: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private resultsContainer: HTMLElement | null = null;
  private detailInput: HTMLInputElement | null = null;
  private isOpen = false;
  private debounceTimer: number | null = null;

  constructor(options: AddressFinderOptions = {}) {
    this.apiClient = new AddressApiClient(options.apiKey);

    // 기본 옵션 설정
    this.options = {
      apiKey: options.apiKey || '',
      countPerPage: options.countPerPage || 10,
      currentPage: options.currentPage || 1,
      containerId: options.containerId || 'address-finder-container',
      onSelect: options.onSelect || (() => {}),
      showDetailInput: options.showDetailInput !== false,
      customClass: options.customClass || '',
      autocompleteMode: options.autocompleteMode || false,
    };
  }

  /**
   * 주소 검색 UI 초기화
   */
  public init(targetElement?: HTMLElement): void {
    if (targetElement) {
      this.container = targetElement;
    } else {
      this.container = document.getElementById(this.options.containerId);
    }

    if (!this.container) {
      throw new Error(`Container element not found: ${this.options.containerId}`);
    }

    this.render();
    this.attachEventListeners();
  }

  /**
   * UI 렌더링
   */
  private render(): void {
    if (!this.container) return;

    const className = this.options.customClass ? ` ${this.options.customClass}` : '';

    this.container.innerHTML = `
      <div class="kaf-wrapper${className}">
        <div class="kaf-search-box">
          <input
            type="text"
            class="kaf-search-input"
            placeholder="주소를 입력하세요 (예: 판교역로 235)"
            autocomplete="off"
          />
          <button type="button" class="kaf-search-btn">검색</button>
        </div>
        <div class="kaf-results" style="display: none;">
          <div class="kaf-results-header">
            <span class="kaf-results-count">검색 결과</span>
            <button type="button" class="kaf-close-btn">×</button>
          </div>
          <div class="kaf-results-list"></div>
        </div>
        ${this.options.showDetailInput ? `
          <div class="kaf-detail-box" style="display: none;">
            <input
              type="text"
              class="kaf-detail-input"
              placeholder="상세주소를 입력하세요"
            />
          </div>
        ` : ''}
        <div class="kaf-selected-address" style="display: none;"></div>
      </div>
    `;

    this.searchInput = this.container.querySelector('.kaf-search-input');
    this.resultsContainer = this.container.querySelector('.kaf-results');
    this.detailInput = this.container.querySelector('.kaf-detail-input');
  }

  /**
   * 이벤트 리스너 등록
   */
  private attachEventListeners(): void {
    if (!this.container) return;

    // 검색 버튼 클릭
    const searchBtn = this.container.querySelector('.kaf-search-btn');
    searchBtn?.addEventListener('click', () => this.handleSearch());

    // 검색 입력 엔터키
    this.searchInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });

    // 자동완성 모드
    if (this.options.autocompleteMode) {
      this.searchInput?.addEventListener('input', () => {
        this.handleAutocomplete();
      });
    }

    // 닫기 버튼
    const closeBtn = this.container.querySelector('.kaf-close-btn');
    closeBtn?.addEventListener('click', () => this.closeResults());

    // 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.container?.contains(e.target as Node)) {
        this.closeResults();
      }
    });
  }

  /**
   * 자동완성 처리 (디바운스 적용)
   */
  private handleAutocomplete(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.handleSearch();
    }, 300);
  }

  /**
   * 주소 검색 실행
   */
  private async handleSearch(): Promise<void> {
    const keyword = this.searchInput?.value.trim();
    if (!keyword) return;

    try {
      const { results, totalCount } = await this.apiClient.search(
        keyword,
        this.options.currentPage,
        this.options.countPerPage
      );

      this.displayResults(results, totalCount);
    } catch (error) {
      console.error('Search error:', error);
      this.showError('주소 검색 중 오류가 발생했습니다.');
    }
  }

  /**
   * 검색 결과 표시
   */
  private displayResults(results: AddressResult[], totalCount: number): void {
    const resultsList = this.container?.querySelector('.kaf-results-list');
    const resultsCount = this.container?.querySelector('.kaf-results-count');

    if (!resultsList || !resultsCount) return;

    if (results.length === 0) {
      resultsList.innerHTML = '<div class="kaf-no-results">검색 결과가 없습니다.</div>';
    } else {
      resultsCount.textContent = `검색 결과 (${totalCount}건)`;

      resultsList.innerHTML = results.map((result, index) => `
        <div class="kaf-result-item" data-index="${index}">
          <div class="kaf-result-main">
            <span class="kaf-result-type">도로명</span>
            <span class="kaf-result-address">${result.roadAddress}</span>
          </div>
          <div class="kaf-result-sub">
            <span class="kaf-result-type">지번</span>
            <span class="kaf-result-address">${result.jibunAddress}</span>
          </div>
          <div class="kaf-result-zipcode">우편번호: ${result.zipCode}</div>
          ${result.buildingName ? `<div class="kaf-result-building">${result.buildingName}</div>` : ''}
        </div>
      `).join('');

      // 결과 항목 클릭 이벤트
      resultsList.querySelectorAll('.kaf-result-item').forEach((item, index) => {
        item.addEventListener('click', () => this.selectAddress(results[index]));
      });
    }

    this.openResults();
  }

  /**
   * 주소 선택 처리
   */
  private selectAddress(address: AddressResult): void {
    const selectedContainer = this.container?.querySelector('.kaf-selected-address');

    if (selectedContainer) {
      selectedContainer.innerHTML = `
        <div class="kaf-selected-content">
          <div class="kaf-selected-main">
            <strong>도로명:</strong> ${address.roadAddress}
          </div>
          <div class="kaf-selected-sub">
            <strong>우편번호:</strong> ${address.zipCode}
          </div>
        </div>
      `;
      (selectedContainer as HTMLElement).style.display = 'block';
    }

    // 상세주소 입력 표시
    if (this.options.showDetailInput && this.detailInput) {
      const detailBox = this.container?.querySelector('.kaf-detail-box');
      if (detailBox) {
        (detailBox as HTMLElement).style.display = 'block';
        this.detailInput.focus();
      }
    }

    this.closeResults();

    // 콜백 실행
    const detailAddress = this.detailInput?.value || '';
    this.options.onSelect({
      ...address,
      detailAddress,
    });
  }

  /**
   * 검색 결과 열기
   */
  private openResults(): void {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'block';
      this.isOpen = true;
    }
  }

  /**
   * 검색 결과 닫기
   */
  private closeResults(): void {
    if (this.resultsContainer) {
      this.resultsContainer.style.display = 'none';
      this.isOpen = false;
    }
  }

  /**
   * 에러 표시
   */
  private showError(message: string): void {
    const resultsList = this.container?.querySelector('.kaf-results-list');
    if (resultsList) {
      resultsList.innerHTML = `<div class="kaf-error">${message}</div>`;
      this.openResults();
    }
  }

  /**
   * 컴포넌트 제거
   */
  public destroy(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  /**
   * 선택된 주소 가져오기
   */
  public getSelectedAddress(): { roadAddress: string; zipCode: string; detailAddress: string } | null {
    const selectedContainer = this.container?.querySelector('.kaf-selected-address');
    if (!selectedContainer || selectedContainer.innerHTML === '') {
      return null;
    }

    const roadAddress = selectedContainer.querySelector('.kaf-selected-main')?.textContent?.replace('도로명:', '').trim() || '';
    const zipCode = selectedContainer.querySelector('.kaf-selected-sub')?.textContent?.replace('우편번호:', '').trim() || '';
    const detailAddress = this.detailInput?.value || '';

    return { roadAddress, zipCode, detailAddress };
  }
}
