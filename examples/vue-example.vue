<template>
  <div class="address-form-container">
    <h2>배송 주소 입력</h2>

    <div class="form-group">
      <label>주소 검색</label>
      <div ref="addressContainer"></div>
    </div>

    <div v-if="selectedAddress" class="selected-info">
      <h3>선택된 주소</h3>
      <p><strong>우편번호:</strong> {{ selectedAddress.zipCode }}</p>
      <p><strong>도로명 주소:</strong> {{ selectedAddress.roadAddress }}</p>
      <p><strong>지번 주소:</strong> {{ selectedAddress.jibunAddress }}</p>
      <p v-if="selectedAddress.detailAddress">
        <strong>상세 주소:</strong> {{ selectedAddress.detailAddress }}
      </p>
    </div>

    <button @click="handleSubmit" class="submit-btn">
      주소 저장
    </button>
  </div>
</template>

<script>
import { KoreanAddressFinder } from 'korean-address-finder';
import 'korean-address-finder/dist/styles.css';

export default {
  name: 'AddressForm',

  data() {
    return {
      finder: null,
      selectedAddress: null,
    };
  },

  mounted() {
    // 주소 검색기 초기화
    this.finder = new KoreanAddressFinder({
      onSelect: (address) => {
        this.selectedAddress = address;
        console.log('선택된 주소:', address);
      },
      showDetailInput: true,
      autocompleteMode: true,
    });

    this.finder.init(this.$refs.addressContainer);
  },

  beforeUnmount() {
    // 컴포넌트 제거 시 정리
    if (this.finder) {
      this.finder.destroy();
    }
  },

  methods: {
    handleSubmit() {
      if (this.selectedAddress) {
        const formData = {
          zipCode: this.selectedAddress.zipCode,
          roadAddress: this.selectedAddress.roadAddress,
          jibunAddress: this.selectedAddress.jibunAddress,
          detailAddress: this.selectedAddress.detailAddress,
          buildingName: this.selectedAddress.buildingName,
        };

        console.log('폼 데이터:', formData);
        alert('주소가 제출되었습니다!');
      } else {
        alert('주소를 선택해주세요.');
      }
    },
  },
};
</script>

<style scoped>
.address-form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.selected-info {
  background-color: #f0f8ff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #357abd;
}
</style>
