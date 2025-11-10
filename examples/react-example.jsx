/**
 * React에서 Korean Address Finder 사용 예제
 */

import React, { useEffect, useRef, useState } from 'react';
import { KoreanAddressFinder } from 'korean-address-finder';
import 'korean-address-finder/dist/styles.css';

function AddressForm() {
  const containerRef = useRef(null);
  const finderRef = useRef(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 주소 검색기 초기화
    if (containerRef.current && !finderRef.current) {
      finderRef.current = new KoreanAddressFinder({
        onSelect: (address) => {
          setSelectedAddress(address);
          console.log('선택된 주소:', address);
        },
        showDetailInput: true,
        autocompleteMode: true,
      });

      finderRef.current.init(containerRef.current);
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (finderRef.current) {
        finderRef.current.destroy();
        finderRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedAddress) {
      // 폼 제출 처리
      const formData = {
        zipCode: selectedAddress.zipCode,
        roadAddress: selectedAddress.roadAddress,
        jibunAddress: selectedAddress.jibunAddress,
        detailAddress: selectedAddress.detailAddress,
        buildingName: selectedAddress.buildingName,
      };

      console.log('폼 데이터:', formData);
      alert('주소가 제출되었습니다!');
    } else {
      alert('주소를 선택해주세요.');
    }
  };

  return (
    <div className="address-form-container">
      <h2>배송 주소 입력</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>주소 검색</label>
          <div ref={containerRef}></div>
        </div>

        {selectedAddress && (
          <div className="selected-info">
            <h3>선택된 주소</h3>
            <p><strong>우편번호:</strong> {selectedAddress.zipCode}</p>
            <p><strong>도로명 주소:</strong> {selectedAddress.roadAddress}</p>
            <p><strong>지번 주소:</strong> {selectedAddress.jibunAddress}</p>
            {selectedAddress.detailAddress && (
              <p><strong>상세 주소:</strong> {selectedAddress.detailAddress}</p>
            )}
          </div>
        )}

        <button type="submit" className="submit-btn">
          주소 저장
        </button>
      </form>
    </div>
  );
}

export default AddressForm;
