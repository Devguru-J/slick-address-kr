import { JusoApiResponse, AddressResult } from './types';

/**
 * 주소 검색 API 클라이언트
 * 행정안전부 주소 API를 사용하여 주소를 검색합니다.
 */
export class AddressApiClient {
  private apiUrl = 'https://business.juso.go.kr/addrlink/addrLinkApi.do';
  private confmKey: string;

  constructor(apiKey?: string) {
    // API 키는 필수입니다. 행정안전부 도로명주소 사이트에서 직접 발급받아야 합니다.
    // https://business.juso.go.kr/addrlink/openApi/searchApi.do
    this.confmKey = apiKey || '';
  }

  /**
   * 주소 검색
   * @param keyword 검색 키워드
   * @param currentPage 현재 페이지 번호
   * @param countPerPage 페이지당 결과 수
   * @returns 주소 검색 결과
   */
  async search(
    keyword: string,
    currentPage: number = 1,
    countPerPage: number = 10
  ): Promise<{ results: AddressResult[]; totalCount: number }> {
    if (!keyword || keyword.trim().length === 0) {
      return { results: [], totalCount: 0 };
    }

    if (!this.confmKey) {
      throw new Error(
        'API 키가 설정되지 않았습니다. KoreanAddressFinder 생성 시 apiKey 옵션을 전달하세요. ' +
          '키 발급: https://business.juso.go.kr/addrlink/openApi/searchApi.do'
      );
    }

    try {
      const params = new URLSearchParams({
        confmKey: this.confmKey,
        currentPage: currentPage.toString(),
        countPerPage: countPerPage.toString(),
        keyword: keyword.trim(),
        resultType: 'json',
      });

      const response = await fetch(`${this.apiUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: JusoApiResponse = await response.json();

      // 에러 체크
      if (data.results.common.errorCode !== '0') {
        console.error('API Error:', data.results.common.errorMessage);
        return { results: [], totalCount: 0 };
      }

      // 결과 변환
      const results: AddressResult[] = data.results.juso.map((item) => ({
        roadAddress: item.roadAddr,
        jibunAddress: item.jibunAddr,
        zipCode: item.zipNo,
        buildingName: item.bdNm || '',
        sido: item.siNm,
        sigungu: item.sggNm,
        bname: item.emdNm,
        extraAddress: this.buildExtraAddress(item),
      }));

      return {
        results,
        totalCount: parseInt(data.results.common.totalCount, 10),
      };
    } catch (error) {
      console.error('Address search error:', error);
      throw error;
    }
  }

  /**
   * 참고항목 생성
   */
  private buildExtraAddress(item: any): string {
    const extras: string[] = [];

    if (item.bdNm) {
      extras.push(item.bdNm);
    }

    if (item.detBdNmList) {
      extras.push(item.detBdNmList);
    }

    return extras.join(', ');
  }
}
