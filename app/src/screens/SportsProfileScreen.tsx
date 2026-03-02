import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Alert, Platform, Image } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function SportsProfileScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const registrationData = route.params?.registrationData || {};

    const [selectedLevel, setSelectedLevel] = useState('State');
    const [years, setYears] = useState(2);
    const [selectedSport, setSelectedSport] = useState('Athletics');
    const [selectedEvent, setSelectedEvent] = useState('100m Sprint');
    const [isSportDropdownVisible, setSportDropdownVisible] = useState(false);
    const [isEventDropdownVisible, setEventDropdownVisible] = useState(false);

    const sportsList = [
        'Athletics', 'Swimming', 'Gymnastics', 'Weightlifting',
        'Boxing', 'Wrestling', 'Archery', 'Shooting'
    ];

    const specificEventsMapping: { [key: string]: string[] } = {
        'Athletics': ['100m Sprint', '200m Sprint', '400m Run', '800m Run', 'Long Jump', 'High Jump', 'Shot Put'],
        'Swimming': ['50m Freestyle', '100m Freestyle', '100m Backstroke', '100m Breaststroke', '100m Butterfly'],
        'Gymnastics': ['Floor Exercise', 'Pommel Horse', 'Still Rings', 'Vault', 'Parallel Bars', 'Horizontal Bar'],
        'Weightlifting': ['All'],
        'Boxing': ['Light Flyweight', 'Lightweight', 'Welterweight', 'Middleweight', 'Heavyweight'],
        'Wrestling': ['Freestyle 57kg', 'Freestyle 65kg', 'Freestyle 74kg', 'Greco-Roman 60kg', 'Greco-Roman 77kg'],
        'Archery': ['Recurve Individual', 'Compound Individual'],
        'Shooting': ['10m Air Rifle', '50m Rifle 3 Positions', '10m Air Pistol', '25m Rapid Fire Pistol']
    };

    // Get events for currently selected sport, or a generic fallback
    const availableEvents = specificEventsMapping[selectedSport] || ['General'];

    const levels = [
        { id: 'Beginner', title: 'Beginner', icon: 'school', iconType: 'Ionicons' },
        { id: 'District', title: 'District', icon: 'business', iconType: 'Ionicons' },
        { id: 'State', title: 'State', icon: 'flag', iconType: 'Ionicons' },
        { id: 'National', title: 'National', icon: 'trophy', iconType: 'Ionicons' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Header */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sports Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Progress Bar Segmented */}
                <View style={styles.progressContainer}>
                    <View style={styles.segmentsRow}>
                        <View style={[styles.progressSegment, styles.segmentActive]} />
                        <View style={styles.progressSegment} />
                        <View style={styles.progressSegment} />
                    </View>
                    <Text style={styles.stepText}>Step 1 of 3</Text>
                </View>

                {/* Title & Description */}
                <Text style={styles.mainTitle}>Your Discipline</Text>
                <Text style={styles.subtitle}>
                    Tell us about your primary athletic discipline and experience level to customize your assessment.
                </Text>

                {/* Form Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Primary Sport</Text>
                    <TouchableOpacity
                        style={styles.dropdownInput}
                        onPress={() => setSportDropdownVisible(!isSportDropdownVisible)}
                    >
                        <View style={styles.leftRow}>
                            <MaterialCommunityIcons name="run" size={24} color={Colors.primary} />
                            <Text style={styles.placeholderText}>{selectedSport}</Text>
                        </View>
                        <Ionicons name={isSportDropdownVisible ? "chevron-up" : "chevron-down"} size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>

                    {isSportDropdownVisible && (
                        <View style={styles.dropdownList}>
                            {sportsList.map(sport => (
                                <TouchableOpacity
                                    key={sport}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedSport(sport);
                                        // Update event dropdown to default first option of new sport
                                        setSelectedEvent(specificEventsMapping[sport]?.[0] || 'General');
                                        setSportDropdownVisible(false);
                                    }}
                                >
                                    <Text style={[styles.dropdownItemText, selectedSport === sport && { color: Colors.primary, fontWeight: 'bold' }]}>
                                        {sport}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={[styles.section, { zIndex: 10 }]}>
                    <Text style={styles.label}>Specific Event / Position</Text>
                    <TouchableOpacity
                        style={styles.dropdownInput}
                        onPress={() => setEventDropdownVisible(!isEventDropdownVisible)}
                    >
                        <View style={styles.leftRow}>
                            <MaterialCommunityIcons name="medal-outline" size={24} color={Colors.primary} />
                            <Text style={styles.placeholderText}>{selectedEvent}</Text>
                        </View>
                        <Ionicons name={isEventDropdownVisible ? "chevron-up" : "chevron-down"} size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>

                    {isEventDropdownVisible && (
                        <View style={styles.dropdownList}>
                            {availableEvents.map(event => (
                                <TouchableOpacity
                                    key={event}
                                    style={styles.dropdownItem}
                                    onPress={() => {
                                        setSelectedEvent(event);
                                        setEventDropdownVisible(false);
                                    }}
                                >
                                    <Text style={[styles.dropdownItemText, selectedEvent === event && { color: Colors.primary, fontWeight: 'bold' }]}>
                                        {event}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Highest Level Played</Text>
                    <View style={styles.levelGrid}>
                        {levels.map((level) => {
                            const isSelected = selectedLevel === level.id;
                            return (
                                <TouchableOpacity
                                    key={level.id}
                                    style={[styles.levelCard, isSelected && styles.levelCardSelected]}
                                    onPress={() => setSelectedLevel(level.id)}
                                    activeOpacity={0.7}
                                >
                                    {isSelected && (
                                        <View style={styles.checkIcon}>
                                            <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                                        </View>
                                    )}
                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name={level.icon as any}
                                            size={28}
                                            color={isSelected ? '#9CA3AF' : '#D1D5DB'}
                                        />
                                    </View>
                                    <Text style={[styles.levelText, isSelected && styles.levelTextSelected]}>
                                        {level.title}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.section, { paddingBottom: 60 }]}>
                    <Text style={styles.label}>Years of Training</Text>
                    <View style={styles.stepperContainer}>
                        <TouchableOpacity
                            style={[
                                styles.stepperButtonMinus,
                                years === 0 && { opacity: 0.5 }
                            ]}
                            onPress={() => setYears(Math.max(0, years - 1))}
                            disabled={years === 0}
                        >
                            <Text style={styles.minusText}>—</Text>
                        </TouchableOpacity>

                        <View style={styles.stepperValueContainer}>
                            <Text style={styles.stepperValue}>{years}</Text>
                            <Text style={styles.stepperLabel}> years</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.stepperButtonPlus}
                            onPress={() => setYears(years + 1)}
                        >
                            <Ionicons name="add" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.bottomFooter}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={async () => {

                        try {
                            const formData = new FormData();

                            formData.append('name', registrationData.name || `Athlete ${Math.floor(Math.random() * 10000)}`);
                            formData.append('email', registrationData.email || `athlete${Math.floor(Math.random() * 10000)}@example.com`);
                            formData.append('password', registrationData.password || 'password123');
                            formData.append('role', 'athlete');
                            formData.append('gender', registrationData.gender || 'male');
                            if (registrationData.height) formData.append('height', registrationData.height);
                            if (registrationData.weight) formData.append('weight', registrationData.weight);
                            formData.append('address', registrationData.address || '');
                            formData.append('state', registrationData.state || '');

                            if (registrationData.dateOfBirth) {
                                formData.append('dateOfBirth', new Date(registrationData.dateOfBirth.split('/').reverse().join('-')).toISOString());
                            }

                            // It's a single sport right now from selectedSport
                            formData.append('sports', selectedSport);

                            // Let's also append the specific event as a standard field
                            formData.append('specificEvent', selectedEvent);

                            if (registrationData.aadhaarNumber) {
                                formData.append('aadhaarNumber', registrationData.aadhaarNumber);
                            }


                            if (registrationData.aadhaarUri) {
                                const adFileUrl = registrationData.aadhaarUri;
                                const filename = adFileUrl.split('/').pop() || 'aadhaar.jpg';
                                const match = /\.(\w+)$/.exec(filename);
                                const type = match ? `image/${match[1]}` : `image/jpeg`;

                                formData.append('aadhaarCard', {
                                    uri: Platform.OS === 'android' && !adFileUrl.startsWith('file://') ? `file://${adFileUrl}` : adFileUrl,
                                    name: filename,
                                    type,
                                } as any);
                            }

                            if (registrationData.dobUri) {
                                const dobFileUrl = registrationData.dobUri;
                                const filename = dobFileUrl.split('/').pop() || 'dob.jpg';
                                const match = /\.(\w+)$/.exec(filename);
                                const type = match ? `image/${match[1]}` : `image/jpeg`;

                                formData.append('dobCertificate', {
                                    uri: Platform.OS === 'android' && !dobFileUrl.startsWith('file://') ? `file://${dobFileUrl}` : dobFileUrl,
                                    name: filename,
                                    type,
                                } as any);
                            }

                            // Append Optional Competition Video
                            if (registrationData.competitionVideoUri) {
                                const videoObjUrl = registrationData.competitionVideoUri;
                                const filename = videoObjUrl.split('/').pop() || 'competition.mp4';
                                const match = /\.(\w+)$/.exec(filename);
                                const type = match ? `video/${match[1]}` : `video/mp4`;

                                formData.append('competitionVideo', {
                                    uri: Platform.OS === 'android' && !videoObjUrl.startsWith('file://') ? `file://${videoObjUrl}` : videoObjUrl,
                                    name: filename,
                                    type,
                                } as any);
                            }

                            // Append Profile Photo
                            if (registrationData.profilePhotoUri) {
                                const filename = registrationData.profilePhotoUri.split('/').pop() || 'profile.jpg';
                                const match = /\.(\w+)$/.exec(filename);
                                const type = match ? `image/${match[1]}` : `image/jpeg`;

                                formData.append('profilePhoto', {
                                    uri: Platform.OS === 'android' && !registrationData.profilePhotoUri.startsWith('file://') ? `file://${registrationData.profilePhotoUri}` : registrationData.profilePhotoUri,
                                    name: filename,
                                    type,
                                } as any);
                            }

                            const response = await fetch(`${apiClient.defaults.baseURL}/auth/register`, {
                                method: 'POST',
                                body: formData,
                            });

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(errorData.message || 'Registration failed');
                            }

                            const resData = await response.json();

                            if (resData.token) {
                                await AsyncStorage.setItem('userToken', resData.token);
                                await AsyncStorage.setItem('userName', resData.name || registrationData.name || '');
                                await AsyncStorage.setItem('userSports', JSON.stringify(resData.sports || [selectedSport]));
                            }
                            navigation.navigate('Home');
                        } catch (err: any) {
                            console.error('Registration failed:', err);
                            const msg = err.response?.data?.message || err.message;
                            Alert.alert("Registration Failed", msg);
                        }
                    }}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>Save & Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        justifyContent: 'center',
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
    progressContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    segmentsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
        paddingHorizontal: Spacing.md,
        gap: 8,
    },
    progressSegment: {
        flex: 1,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
    },
    segmentActive: {
        backgroundColor: Colors.primary,
    },
    stepText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 28,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 10,
    },
    photoUploadContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    photoUploadCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F0F5FF',
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Ensures the image respects the border radius
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        resizeMode: 'cover',
    },
    photoUploadText: {
        marginTop: 8,
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '600',
    },
    photoSelectedContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    photoSelectedText: {
        marginTop: 4,
        fontSize: 11,
        color: Colors.success,
        fontWeight: '600',
    },
    dropdownInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    leftRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#111827',
        marginLeft: 12,
    },
    dropdownList: {
        marginTop: 8,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#4B5563',
    },
    levelGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between',
    },
    levelCard: {
        width: (width - Spacing.md * 2 - 12) / 2,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        position: 'relative',
    },
    levelCardSelected: {
        borderColor: Colors.primary,
        backgroundColor: '#F0F5FF',
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    iconContainer: {
        marginBottom: 8,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    levelTextSelected: {
        color: '#4B5563',
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 6,
        height: 60,
    },
    stepperButtonMinus: {
        width: 48,
        height: 48,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    minusText: {
        fontSize: 20,
        color: '#6B7280',
        fontWeight: 'bold',
    },
    stepperButtonPlus: {
        width: 48,
        height: 48,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepperValueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    stepperValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    stepperLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    bottomFooter: {
        backgroundColor: Colors.white,
        paddingHorizontal: Spacing.md,
        paddingBottom: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});
