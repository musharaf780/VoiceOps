import React from 'react';
import {
  View, Text, Pressable, ScrollView, StatusBar,
  TextInput, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const INVITED = [
  { id: 1, initials: 'JT', name: 'James Torres', contact: 'james@constructco.com', status: 'JOINED', avatarBg: 'rgba(79,142,247,0.15)', avatarColor: '#4F8EF7' },
  { id: 2, initials: 'MC', name: 'Maria Chen', contact: 'maria@constructco.com', status: 'PENDING', avatarBg: 'rgba(79,191,133,0.12)', avatarColor: '#4FBF85' },
];

const STATUS_STYLES = {
  JOINED:  { bg: 'rgba(79,191,133,0.12)', color: '#4FBF85' },
  PENDING: { bg: 'rgba(247,169,79,0.14)', color: '#F7A94F' },
};

export default function TeamSetupScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.blue} />
        </Pressable>

        <View style={styles.stepIndicator}>
          {[colors.green, colors.green, colors.blue].map((c, i) => (
            <View key={i} style={[styles.stepBar, { backgroundColor: c }]} />
          ))}
        </View>
        <Text style={styles.stepLabel}>Step 3 of 3</Text>
        <Text style={styles.title}>Invite your field workers</Text>
        <Text style={styles.subtitle}>
          Add your team members so they can start submitting voice reports.
        </Text>

        <View style={styles.inviteRow}>
          <Feather name="mail" size={16} color={colors.blue} style={{ marginLeft: 16 }} />
          <TextInput
            placeholder="worker@company.com"
            placeholderTextColor={colors.textSecondary}
            style={styles.inviteInput}
          />
          <Pressable style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>Invite</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>INVITED (2)</Text>

        <View style={styles.invitedList}>
          {INVITED.map(person => {
            const statusStyle = STATUS_STYLES[person.status];
            return (
              <View key={person.id} style={styles.inviteCard}>
                <View style={[styles.avatar, { backgroundColor: person.avatarBg }]}>
                  <Text style={[styles.avatarText, { color: person.avatarColor }]}>
                    {person.initials}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inviteName}>{person.name}</Text>
                  <Text style={styles.inviteContact}>{person.contact}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                  <View style={[styles.statusDot, { backgroundColor: statusStyle.color }]} />
                  <Text style={[styles.statusText, { color: statusStyle.color }]}>
                    {person.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          style={styles.finishBtn}
          onPress={() => navigation.navigate('Welcome', { role: 'manager' })}
        >
          <Text style={styles.finishBtnText}>Finish Setup</Text>
        </Pressable>

        <Text style={styles.skipLink}>Skip for now</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  backBtn: { paddingTop: 12, paddingBottom: 20 },
  stepIndicator: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  stepBar: { flex: 1, height: 3, borderRadius: 2 },
  stepLabel: {
    fontFamily: fonts.inter.regular,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.inter.bold,
    fontSize: 26,
    letterSpacing: -0.52,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.inter.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  inviteRow: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    height: 52,
  },
  inviteInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.inter.regular,
    color: colors.textSecondary,
  },
  inviteBtn: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  inviteBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 12,
    color: 'white',
  },
  sectionLabel: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 11,
    color: colors.textTertiary,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  invitedList: { gap: 8, marginBottom: 24 },
  inviteCard: {
    backgroundColor: colors.bgSurface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    padding: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.inter.bold, fontSize: 13 },
  inviteName: {
    fontFamily: fonts.inter.medium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inviteContact: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  statusDot: { width: 5, height: 5, borderRadius: 999 },
  statusText: { fontFamily: fonts.inter.bold, fontSize: 10, letterSpacing: 0.5 },
  finishBtn: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  finishBtnText: { fontFamily: fonts.inter.bold, fontSize: 16, color: 'white' },
  skipLink: {
    fontFamily: fonts.inter.medium,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
