import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function UploadingDataScreen() {
    const navigation = useNavigation<any>();

    // Animation States
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(1); // 1: Uploading, 2: AI Verification, 3: Success
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Start pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        ).start();

        // Simulate Upload Progress
        let progress = 0;
        const uploadInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 5;
            if (progress > 100) progress = 100;

            setUploadProgress(progress);

            if (progress === 100) {
                clearInterval(uploadInterval);
                setCurrentStep(2);

                // Simulate AI Verification taking 3 seconds
                setTimeout(() => {
                    setCurrentStep(3);
                }, 3000);
            }
        }, 300);

        return () => clearInterval(uploadInterval);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Uploading Data</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Network Alert (Simulation) - Removed as it confused users */}

                {/* Main Illustration */}
                <View style={styles.illustrationContainer}>
                    <Animated.View style={[styles.pulseRing, { transform: [{ scale: currentStep === 3 ? 1 : pulseAnim }] }]}>
                        <View style={[styles.iconCircle, currentStep === 3 && { backgroundColor: Colors.success }]}>
                            {currentStep === 3 ? (
                                <Ionicons name="checkmark-sharp" size={40} color={Colors.white} />
                            ) : (
                                <MaterialCommunityIcons name="head-lightbulb" size={40} color={Colors.white} />
                            )}
                        </View>
                    </Animated.View>
                    <Text style={styles.mainTitle}>
                        {currentStep === 1 && 'Uploading Video...'}
                        {currentStep === 2 && 'Analyzing Form...'}
                        {currentStep === 3 && 'Analysis Complete!'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {currentStep === 1 && 'Securely transferring your video to our servers.'}
                        {currentStep === 2 && 'AI is processing biomechanics from the recorded session.'}
                        {currentStep === 3 && 'Your assessment has been successfully submitted.'}
                    </Text>
                </View>

                {/* Video Info Card */}
                <View style={styles.videoCard}>
                    <View style={styles.videoThumbnail}>
                        <MaterialCommunityIcons name="run" size={32} color={Colors.white} />
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={12} color={Colors.textPrimary} />
                        </View>
                    </View>

                    <View style={styles.videoTextContent}>
                        <Text style={styles.videoTitle}>Athlete_042_Sprint.mp4</Text>
                        <Text style={styles.videoSubtitle}>24 MB • 1080p 60fps</Text>
                    </View>

                    <TouchableOpacity style={styles.editButton}>
                        <Ionicons name="pencil" size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Progress Steps */}
                <View style={styles.progressCard}>
                    {/* Step 1 */}
                    <View style={styles.stepRow}>
                        <View style={currentStep >= 1 ? styles.stepIconContainerActive : styles.stepIconContainerPending}>
                            <Ionicons name="cloud-upload" size={20} color={currentStep >= 1 ? Colors.white : '#9CA3AF'} />
                        </View>
                        <View style={styles.stepContent}>
                            <View style={styles.stepTitleRow}>
                                <Text style={currentStep >= 1 ? styles.stepTitleActive : styles.stepTitlePending}>Uploading Video</Text>
                                {currentStep === 1 && <Text style={styles.percentageText}>{uploadProgress}%</Text>}
                            </View>
                            {currentStep === 1 && (
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${uploadProgress}%` }]} />
                                </View>
                            )}
                            {currentStep === 1 && <Text style={styles.stepSubtitleActive}>Please wait while we upload...</Text>}
                            {currentStep > 1 && <Text style={styles.stepSubtitleActive}>Upload Complete</Text>}
                        </View>
                    </View>

                    {/* Connecting Line 1 */}
                    <View style={[styles.connectingLine, { top: 52 }]} />

                    {/* Step 2 */}
                    <View style={styles.stepRow}>
                        <View style={currentStep >= 2 ? styles.stepIconContainerActive : styles.stepIconContainerPending}>
                            <MaterialCommunityIcons name="robot-outline" size={20} color={currentStep >= 2 ? Colors.white : '#9CA3AF'} />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={currentStep >= 2 ? styles.stepTitleActive : styles.stepTitlePending}>AI Verification</Text>
                            {currentStep === 1 && <Text style={styles.stepSubtitlePending}>Waiting for upload...</Text>}
                            {currentStep === 2 && <Text style={styles.stepSubtitleActive}>Analyzing biomechanics...</Text>}
                            {currentStep > 2 && <Text style={styles.stepSubtitleActive}>Verification Complete</Text>}
                        </View>
                    </View>

                    {/* Connecting Line 2 */}
                    <View style={[styles.connectingLine, { top: 124 }]} />

                    {/* Step 3 */}
                    <View style={styles.stepRow}>
                        <View style={currentStep >= 3 ? [styles.stepIconContainerActive, { backgroundColor: Colors.success }] : styles.stepIconContainerPending}>
                            <Ionicons name="checkmark-circle" size={20} color={currentStep >= 3 ? Colors.white : '#9CA3AF'} />
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={currentStep >= 3 ? styles.stepTitleActive : styles.stepTitlePending}>Submission Successful</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomFooter}>
                {currentStep === 3 ? (
                    <TouchableOpacity
                        style={styles.activeButton}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.activeButtonText}>Back to Dashboard</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.disabledButton}
                        disabled={true}
                    >
                        <Ionicons name="refresh" size={20} color="#9CA3AF" style={styles.spinnerIcon} />
                        <Text style={styles.disabledButtonText}>Please wait...</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        position: 'absolute',
        left: Spacing.md,
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    scrollContent: {
        padding: Spacing.md,
        paddingBottom: 40,
    },
    alertBox: {
        flexDirection: 'row',
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FEF3C7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    alertIcon: {
        marginTop: 2,
        marginRight: 12,
    },
    alertTextContent: {
        flex: 1,
    },
    alertTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#92400E',
        marginBottom: 4,
    },
    alertSubtitle: {
        fontSize: 13,
        color: '#92400E',
        lineHeight: 18,
    },
    illustrationContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    pulseRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    videoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    videoThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#C2410C', // Orange placeholder
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        position: 'relative',
    },
    playButton: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 2,
    },
    videoTextContent: {
        flex: 1,
    },
    videoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    videoSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    editButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressCard: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
        position: 'relative',
    },
    connectingLine: {
        position: 'absolute',
        left: 40,
        width: 2,
        height: 36,
        backgroundColor: '#F3F4F6',
        zIndex: 0,
    },
    stepRow: {
        flexDirection: 'row',
        marginBottom: 24,
        zIndex: 1,
    },
    stepIconContainerActive: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stepIconContainerPending: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    stepContent: {
        flex: 1,
        justifyContent: 'center',
    },
    stepTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stepTitleActive: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    percentageText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    stepSubtitleActive: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    stepTitlePending: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 4,
    },
    stepSubtitlePending: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    bottomFooter: {
        paddingHorizontal: Spacing.md,
        paddingBottom: 24,
        paddingTop: 10,
    },
    disabledButton: {
        backgroundColor: '#E5E7EB',
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    spinnerIcon: {
        marginRight: 4,
    },
    disabledButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '700',
    },
    activeButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    activeButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});
