import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    ToastAndroid,
    View,
    AppState,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CodePush, { DownloadProgress } from 'react-native-code-push';

import RootNavigator from './src/navigation/RootNavigator';
import { getDeviceInfo } from './src/utils/deviceInfo';
import { navigationRef } from './src/navigation/navigationService';
import { FontSizeProvider } from './src/context/FontSizeContext';
import { logger } from './src/utils/Logger';

const App = () => {
    const [progress, setProgress] = useState<DownloadProgress | null>(null);

    //앱 상태
    const lastState = useRef(AppState.currentState);

    // 디바이스 정보 로깅
    const fetchDeviceInfo = async () => {
        try {
            const deviceInfo = await getDeviceInfo();
            await logger('Device ID:', deviceInfo.uniqueId);
        } catch (error) {
            console.error('DeviceInfo Error:', error);
        }
    };

    // CodePush 업데이트 체크 및 설치
    const runCodePush = async installMode => {
        await CodePush.notifyAppReady(); // 앱 시작할 때 반드시 호출

        // 백그라운드에서 포그라운드로 돌아왔을 때
        CodePush.sync(
            {
                deploymentKey: 'sSOhYcSnq-Nvbl4LvYZGNdeCMo4o1',
                installMode: installMode,
                updateDialog: {
                    title: '업데이트 알림',
                    mandatoryUpdateMessage: '새로운 필수 업데이트가 있습니다.',
                    mandatoryContinueButtonLabel: '업데이트',
                },
            },
            status => {
                console.log('[CodePush] status:', status);
                switch (status) {
                    case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                        // ToastAndroid.show(
                        //     '업데이트 확인 중...',
                        //     ToastAndroid.SHORT,
                        // );
                        break;
                    case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                        ToastAndroid.show(
                            '업데이트 다운로드 중...',
                            ToastAndroid.SHORT,
                        );
                        break;
                    case CodePush.SyncStatus.INSTALLING_UPDATE:
                        ToastAndroid.show(
                            '업데이트 설치 중...',
                            ToastAndroid.SHORT,
                        );
                        break;
                    case CodePush.SyncStatus.UP_TO_DATE:
                        ToastAndroid.show(
                            '최신 상태입니다.',
                            ToastAndroid.SHORT,
                        );
                        break;
                    case CodePush.SyncStatus.UPDATE_INSTALLED:
                        ToastAndroid.show(
                            '업데이트 완료, 앱을 재시작합니다.',
                            ToastAndroid.SHORT,
                        );
                        break;
                    case CodePush.SyncStatus.UNKNOWN_ERROR:
                        ToastAndroid.show(
                            'CodePush 알 수 없는 오류 발생!',
                            ToastAndroid.SHORT,
                        );
                        break;
                }
            },
            (downloadProgress: DownloadProgress) => {
                setProgress(downloadProgress); // 💡 진행률 상태 저장
            },
        ).catch(error => {
            Alert.alert('코드푸시 오류발생', error);
        });
    };

    useEffect(() => {
        // runCodePush(CodePush.InstallMode.IMMEDIATE);
        fetchDeviceInfo();

        //앱 복귀시, 코드푸시 다운로드
        const subscription = AppState.addEventListener('change', nextState => {
            if (
                lastState.current.match(/inactive|background/) &&
                nextState === 'active'
            ) {
                //ON_NEXT_RESTART
                ToastAndroid.show('포그라운드 복귀', ToastAndroid.SHORT);
                runCodePush(CodePush.InstallMode.IMMEDIATE); // 포그라운드 복귀 시 업데이트 확인
            }
            lastState.current = nextState;
        });

        return () => {
            subscription.remove(); // 언마운트 시 정리
        };
    }, []);

    return (
        <FontSizeProvider>
            <SafeAreaProvider>
                {/* CodePush 진행률 표시 (항상 앱 위에 표시됨) */}
                {progress && (
                    <View style={styles.progressContainerAbsolute}>
                        <Text style={styles.progressText}>
                            ★ 다운로드 중:{' '}
                            {Math.round(
                                (progress.receivedBytes / progress.totalBytes) *
                                    100,
                            )}
                            %
                        </Text>
                    </View>
                )}
                <NavigationContainer ref={navigationRef}>
                    <RootNavigator />
                </NavigationContainer>
            </SafeAreaProvider>
        </FontSizeProvider>
    );
};

// CodePush 래핑
export default CodePush({
    checkFrequency: CodePush.CheckFrequency.MANUAL, // 수동 체크: 앱 시작 시 직접 runCodePush() 호출
    deploymentKey: 'sSOhYcSnq-Nvbl4LvYZGNdeCMo4o1', // 이건 fallback용
})(App);

const styles = StyleSheet.create({
    progressContainerAbsolute: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 9999, // 다른 화면보다 위에
    },
    progressText: {
        backgroundColor: '#000',
        color: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        fontSize: 14,
    },
});
