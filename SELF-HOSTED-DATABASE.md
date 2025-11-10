# 독립 데이터베이스 구축 가이드

완전히 독립적인 주소 검색 시스템을 구축하고 싶다면 이 가이드를 따라하세요.

## 왜 독립 데이터베이스가 필요한가요?

### 장점
- ✅ 완전한 독립성 (외부 API 의존 없음)
- ✅ 빠른 응답 속도
- ✅ API 호출 제한 없음
- ✅ 오프라인 환경에서도 사용 가능
- ✅ 데이터 커스터마이징 가능

### 단점
- ❌ 서버 및 DB 관리 필요
- ❌ 데이터 업데이트 수동 관리
- ❌ 초기 구축 비용
- ❌ 스토리지 용량 필요 (약 3-5GB)

## 옵션 1: 공공데이터 직접 다운로드

### 1단계: 데이터 다운로드

1. [공공데이터포털](https://www.data.go.kr/) 접속
2. "도로명주소 건물" 검색
3. "행정안전부_도로명주소 건물DB" 선택
4. 파일데이터 탭에서 최신 데이터 다운로드

### 2단계: 데이터베이스 구축

#### PostgreSQL 사용 예제

```sql
-- 데이터베이스 생성
CREATE DATABASE korean_address;

-- 테이블 생성
CREATE TABLE road_addresses (
    id SERIAL PRIMARY KEY,
    road_addr VARCHAR(500),          -- 도로명주소
    road_addr_part1 VARCHAR(400),    -- 도로명주소(참고항목 제외)
    road_addr_part2 VARCHAR(100),    -- 도로명주소 참고항목
    jibun_addr VARCHAR(500),         -- 지번주소
    zip_no VARCHAR(10),              -- 우편번호
    bd_nm VARCHAR(200),              -- 건물명
    si_nm VARCHAR(50),               -- 시도명
    sgg_nm VARCHAR(50),              -- 시군구명
    emd_nm VARCHAR(50),              -- 읍면동명
    rn VARCHAR(200),                 -- 도로명
    buld_mnnm VARCHAR(10),           -- 건물본번
    buld_slno VARCHAR(10),           -- 건물부번

    -- 검색 최적화를 위한 인덱스
    CONSTRAINT unique_address UNIQUE(road_addr, jibun_addr)
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX idx_road_addr ON road_addresses(road_addr);
CREATE INDEX idx_jibun_addr ON road_addresses(jibun_addr);
CREATE INDEX idx_si_nm ON road_addresses(si_nm);
CREATE INDEX idx_sgg_nm ON road_addresses(sgg_nm);
CREATE INDEX idx_emd_nm ON road_addresses(emd_nm);
CREATE INDEX idx_zip_no ON road_addresses(zip_no);

-- 전문 검색을 위한 인덱스 (PostgreSQL)
CREATE INDEX idx_road_addr_gin ON road_addresses
    USING gin(to_tsvector('korean', road_addr));
CREATE INDEX idx_jibun_addr_gin ON road_addresses
    USING gin(to_tsvector('korean', jibun_addr));
```

#### MySQL 사용 예제

```sql
-- 데이터베이스 생성
CREATE DATABASE korean_address
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE korean_address;

-- 테이블 생성
CREATE TABLE road_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    road_addr VARCHAR(500),
    road_addr_part1 VARCHAR(400),
    road_addr_part2 VARCHAR(100),
    jibun_addr VARCHAR(500),
    zip_no VARCHAR(10),
    bd_nm VARCHAR(200),
    si_nm VARCHAR(50),
    sgg_nm VARCHAR(50),
    emd_nm VARCHAR(50),
    rn VARCHAR(200),
    buld_mnnm VARCHAR(10),
    buld_slno VARCHAR(10),

    INDEX idx_road_addr (road_addr(255)),
    INDEX idx_jibun_addr (jibun_addr(255)),
    INDEX idx_si_nm (si_nm),
    INDEX idx_sgg_nm (sgg_nm),
    INDEX idx_emd_nm (emd_nm),
    INDEX idx_zip_no (zip_no),

    -- Full-text 검색 인덱스
    FULLTEXT INDEX ft_road_addr (road_addr) WITH PARSER ngram,
    FULLTEXT INDEX ft_jibun_addr (jibun_addr) WITH PARSER ngram
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 3단계: 데이터 임포트

#### Python 스크립트로 CSV 임포트

```python
import pandas as pd
import psycopg2
from psycopg2.extras import execute_batch

# CSV 파일 읽기
df = pd.read_csv('address_data.txt',
                 sep='|',
                 encoding='cp949',
                 dtype=str)

# DB 연결
conn = psycopg2.connect(
    dbname="korean_address",
    user="your_user",
    password="your_password",
    host="localhost"
)
cur = conn.cursor()

# 데이터 삽입
data = []
for _, row in df.iterrows():
    data.append((
        row['도로명주소'],
        row['도로명주소(참고항목제외)'],
        row['도로명주소참고항목'],
        row['지번주소'],
        row['우편번호'],
        row['건물명'],
        row['시도명'],
        row['시군구명'],
        row['읍면동명'],
        row['도로명'],
        row['건물본번'],
        row['건물부번']
    ))

# 배치 삽입
execute_batch(cur, """
    INSERT INTO road_addresses
    (road_addr, road_addr_part1, road_addr_part2, jibun_addr,
     zip_no, bd_nm, si_nm, sgg_nm, emd_nm, rn, buld_mnnm, buld_slno)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON CONFLICT (road_addr, jibun_addr) DO NOTHING
""", data, page_size=1000)

conn.commit()
cur.close()
conn.close()

print(f"총 {len(data)}개의 주소 데이터를 임포트했습니다.")
```

### 4단계: API 서버 구축

#### Node.js + Express 예제

```javascript
const express = require('express');
const { Pool } = require('pg');
const app = express();

// PostgreSQL 연결
const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'korean_address',
  password: 'your_password',
  port: 5432,
});

// 주소 검색 API
app.get('/api/address/search', async (req, res) => {
  const { keyword, page = 1, limit = 10 } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: '검색어를 입력하세요' });
  }

  try {
    const offset = (page - 1) * limit;

    // 전문 검색 쿼리
    const query = `
      SELECT
        road_addr, jibun_addr, zip_no, bd_nm,
        si_nm, sgg_nm, emd_nm
      FROM road_addresses
      WHERE
        to_tsvector('korean', road_addr) @@ plainto_tsquery('korean', $1)
        OR to_tsvector('korean', jibun_addr) @@ plainto_tsquery('korean', $1)
      ORDER BY
        CASE
          WHEN road_addr LIKE $1 || '%' THEN 1
          WHEN road_addr LIKE '%' || $1 || '%' THEN 2
          ELSE 3
        END
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [keyword, limit, offset]);

    // 전체 개수 조회
    const countQuery = `
      SELECT COUNT(*)
      FROM road_addresses
      WHERE
        to_tsvector('korean', road_addr) @@ plainto_tsquery('korean', $1)
        OR to_tsvector('korean', jibun_addr) @@ plainto_tsquery('korean', $1)
    `;
    const countResult = await pool.query(countQuery, [keyword]);

    res.json({
      success: true,
      totalCount: parseInt(countResult.rows[0].count),
      results: result.rows.map(row => ({
        roadAddress: row.road_addr,
        jibunAddress: row.jibun_addr,
        zipCode: row.zip_no,
        buildingName: row.bd_nm,
        sido: row.si_nm,
        sigungu: row.sgg_nm,
        bname: row.emd_nm
      }))
    });
  } catch (error) {
    console.error('검색 오류:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다' });
  }
});

app.listen(3000, () => {
  console.log('주소 검색 API 서버가 3000번 포트에서 실행 중입니다.');
});
```

### 5단계: Korean Address Finder 수정

`src/api-client.ts` 파일을 수정하여 자체 API 사용:

```typescript
export class AddressApiClient {
  private apiUrl = 'http://your-server.com/api/address/search'; // 본인 서버 URL

  async search(
    keyword: string,
    currentPage: number = 1,
    countPerPage: number = 10
  ): Promise<{ results: AddressResult[]; totalCount: number }> {
    if (!keyword || keyword.trim().length === 0) {
      return { results: [], totalCount: 0 };
    }

    try {
      const params = new URLSearchParams({
        keyword: keyword.trim(),
        page: currentPage.toString(),
        limit: countPerPage.toString(),
      });

      const response = await fetch(`${this.apiUrl}?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        console.error('API Error:', data.error);
        return { results: [], totalCount: 0 };
      }

      return {
        results: data.results,
        totalCount: data.totalCount,
      };
    } catch (error) {
      console.error('Address search error:', error);
      throw error;
    }
  }
}
```

## 옵션 2: Postcodify 사용

Postcodify는 오픈소스 도로명주소 검색 시스템입니다.

### 설치 및 설정

```bash
# Postcodify 다운로드
git clone https://github.com/poesis/postcodify.git
cd postcodify

# 데이터 다운로드 및 DB 구축
# 자세한 내용은 Postcodify GitHub 참조
```

### 장점
- 이미 최적화된 검색 알고리즘
- 자동 업데이트 스크립트 제공
- PHP 기반으로 간단한 설치

### 단점
- PHP 환경 필요
- 커스터마이징이 제한적

## 데이터 업데이트

주소 데이터는 정기적으로 업데이트해야 합니다.

### 자동 업데이트 스크립트

```bash
#!/bin/bash
# update_address_db.sh

# 최신 데이터 다운로드
wget -O address_latest.zip "공공데이터포털_다운로드_URL"

# 압축 해제
unzip -o address_latest.zip

# DB 업데이트
python import_address_data.py

# 정리
rm address_latest.zip

echo "주소 데이터베이스 업데이트 완료"
```

### Cron으로 자동화 (매월 1일 실행)

```bash
# crontab -e
0 0 1 * * /path/to/update_address_db.sh
```

## 성능 최적화

### 1. 데이터베이스 최적화

```sql
-- PostgreSQL
VACUUM ANALYZE road_addresses;

-- MySQL
OPTIMIZE TABLE road_addresses;
```

### 2. 캐싱 적용

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1시간 캐시

app.get('/api/address/search', async (req, res) => {
  const cacheKey = `search:${req.query.keyword}:${req.query.page}`;

  // 캐시 확인
  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  // DB 조회
  const result = await performSearch(req.query);

  // 캐시 저장
  cache.set(cacheKey, result);

  res.json(result);
});
```

### 3. Redis 캐싱

```javascript
const redis = require('redis');
const client = redis.createClient();

app.get('/api/address/search', async (req, res) => {
  const cacheKey = `search:${req.query.keyword}:${req.query.page}`;

  // Redis에서 확인
  client.get(cacheKey, async (err, data) => {
    if (data) {
      return res.json(JSON.parse(data));
    }

    // DB 조회
    const result = await performSearch(req.query);

    // Redis에 저장 (1시간)
    client.setex(cacheKey, 3600, JSON.stringify(result));

    res.json(result);
  });
});
```

## 비용 예측

### 서버 비용 (월간)

- **AWS EC2 t3.small**: ~$15/월
- **PostgreSQL RDS**: ~$20/월
- **총 예상 비용**: ~$35/월

### 무료 대안

- **Oracle Cloud Free Tier**: 무료
- **Google Cloud Free Tier**: 12개월 무료
- **자체 서버**: 전기세만

## 결론

완전한 독립성이 필요하다면 자체 DB 구축을 추천하지만,
대부분의 경우 행정안전부 공공 API를 사용하는 것이 더 효율적입니다.

### 권장사항

- **소규모 프로젝트**: 행정안전부 API 사용 (현재 구현)
- **중규모 프로젝트**: Postcodify 사용
- **대규모/엔터프라이즈**: 자체 DB 구축
