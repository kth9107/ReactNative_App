# ReactNative_App

이 프로젝트는 물류 공급 담당자를 위한 React Native 기반 모바일 애플리케이션입니다.  
기존 기능을 모두 삭제하였습니다. 일부 주요 기능만 남겨두었습니다.
현재는 테스트용 더미 데이터를 기반으로 화면 흐름과 UI 구성만 확인할 수 있도록 구성되어 있습니다.

> 참고: 민감한 데이터 및 API 연동 코드는 제거되어 있습니다.

## 기술 스택

- React Native (TypeScript)
- React Navigation
- react-native-element-dropdown
- react-native-modal-datetime-picker
- Context API (폰트 크기 조절 기능)
- 커스텀 컴포넌트 및 스타일 시스템 (ScalableText 등)

## 실행 방법

```bash
git clone https://github.com/kth9107/ReactNative_App.git
cd ReactNative_App
npm install
npx react-native run-android  # 또는 run-ios
