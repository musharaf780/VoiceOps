import React from 'react';
import { View, Text, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';
import { REPORTS } from '../../data';
import ReportCard from '../../components/ReportCard';

export default function WorkerReportsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>My Reports</Text>
        {REPORTS.map(r => (
          <ReportCard
            key={r.id}
            report={r}
            onPress={() => navigation.navigate('ReportPreview', { report: r })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  heading: {
    fontFamily: fonts.inter.bold,
    fontSize: 22,
    letterSpacing: -0.44,
    color: colors.textPrimary,
    marginBottom: 16,
  },
});
