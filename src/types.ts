/**
 * 주소 검색 결과 인터페이스
 */
export interface AddressResult {
  /** 도로명 주소 */
  roadAddress: string;
  /** 지번 주소 */
  jibunAddress: string;
  /** 우편번호 */
  zipCode: string;
  /** 건물명 */
  buildingName?: string;
  /** 상세 주소 입력용 */
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

/**
 * 주소 검색 설정 옵션
 */
export interface AddressFinderOptions {
  /** 행정안전부 API 키 (선택사항 - 공개 API 사용 가능) */
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

/**
 * API 응답 인터페이스 (행정안전부 주소 API)
 */
export interface JusoApiResponse {
  results: {
    common: {
      totalCount: string;
      currentPage: string;
      countPerPage: string;
      errorCode: string;
      errorMessage: string;
    };
    juso: Array<{
      roadAddr: string;
      roadAddrPart1: string;
      roadAddrPart2: string;
      jibunAddr: string;
      zipNo: string;
      bdNm: string;
      admCd: string;
      rnMgtSn: string;
      bdMgtSn: string;
      detBdNmList?: string;
      bdKdcd: string;
      siNm: string;
      sggNm: string;
      emdNm: string;
      liNm: string;
      rn: string;
      udrtYn: string;
      buldMnnm: string;
      buldSlno: string;
      mtYn: string;
      lnbrMnnm: string;
      lnbrSlno: string;
      emdNo: string;
    }>;
  };
}
