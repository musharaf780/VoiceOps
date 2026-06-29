import { Feather } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable, ScrollView, StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActionItemRow from '../../components/ActionItemRow';
import FieldRow from '../../components/FieldRow';
import { URGENCY } from '../../data';
import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function ReportPreviewScreen({ navigation, route }) {
  const report = route?.params?.report || {};
  const audioUri = route?.params?.audioUri ?? null;
  const urgencyCfg = URGENCY[report.urgency] || URGENCY.LOW;


  const audioPlayer = useAudioPlayer(audioUri ? { uri: audioUri } : null);
  const audioStatus = useAudioPlayerStatus(audioPlayer);



  const [transcriptExpanded, setTranscriptExpanded] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [items, setItems] = useState(report.actionItems || []);

  const overlayScale = useRef(new Animated.Value(0.7)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const toggleItem = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('workers-instruction').insert({
        id:              report.id,
        worker_id:       report.workerId,
        worker_name:     report.workerName,
        worker_initials: report.workerInitials,
        site:            report.site,
        issue_type:      report.issueType,
        component:       report.component,
        urgency:         report.urgency,
        summary:         report.summary,
        transcript:      report.transcript,
        audio_duration:  report.audioDuration,
        timestamp_full:  report.timestampFull,
        is_read:         false,
        action_items:    items,
        automations:     report.automations,
        audio_uri:       audioUri,
      });

      if (error) {
        console.error('Supabase insert error:', JSON.stringify(error));
        throw error;
      }
    } catch (e) {
      console.error('Failed to save report:', e.message ?? e);
    }

    setSubmitting(false);
    setSubmitted(true);
    Animated.spring(overlayScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }).start();
    Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    setTimeout(() => navigation.navigate('WorkerHome'), 1800);
  };

  const urgencyLabel = report.urgency === 'CRITICAL' || report.urgency === 'HIGH'
    ? `⚡ ${report.urgency} PRIORITY`
    : `${report.urgency} PRIORITY`;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />

      {/* Top nav */}
      <View style={styles.topNav}>
        <Pressable onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color={colors.blue} />
        </Pressable>
        <Text style={styles.navTitle}>Report Preview</Text>
        <Pressable style={styles.submitBtnTop} onPress={handleSubmit}>
          <Text style={styles.submitBtnTopText}>Submit</Text>
        </Pressable>
      </View>

      {/* AI processed indicator */}
      <View style={styles.aiRow}>
        <View style={styles.aiCheck}>
          <Feather name="check" size={9} color={colors.green} />
        </View>
        <Text style={styles.aiText}>AI processed successfully</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* Urgency banner */}
        <View style={[styles.urgencyBanner, {
          backgroundColor: urgencyCfg.bg,
          borderColor: 'rgba(239,68,68,0.18)',
          borderLeftColor: urgencyCfg.stripe,
        }]}>
          <Text style={[styles.urgencyBannerText, { color: urgencyCfg.color }]}>
            {urgencyLabel}
          </Text>
          <Feather name="chevron-down" size={16} color={urgencyCfg.color} />
        </View>

        {/* Transcript card */}
        <View style={styles.card}>
          <Pressable
            style={styles.cardHeader}
            onPress={() => setTranscriptExpanded(!transcriptExpanded)}
          >
            <Text style={styles.cardHeaderText}>ORIGINAL TRANSCRIPT</Text>
            <Feather
              name={transcriptExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.textSecondary}
            />
          </Pressable>
          {transcriptExpanded && (
            <View style={styles.cardBody}>
              {audioUri && (
                <Pressable
                  style={styles.audioPlayRow}
                  onPress={async () => {
                    if (audioStatus.playing) {
                      audioPlayer.pause();
                    } else {
                      try { await audioPlayer.seekTo(0); } catch {}
                      audioPlayer.play();
                    }
                  }}
                >
                  <View style={styles.audioPlayIcon}>
                    <Feather
                      name={audioStatus.playing ? 'pause' : 'play'}
                      size={14}
                      color={colors.blue}
                    />
                  </View>
                  <Text style={styles.audioPlayLabel}>
                    {audioStatus.playing ? 'Pause recording' : 'Play recording'}
                  </Text>
                  <Text style={styles.audioDuration}>{report.audioDuration}</Text>
                </Pressable>
              )}
              <Text style={styles.transcriptText}>{report.transcript}</Text>
            </View>
          )}
        </View>

        {/* Structured report card */}
        <View style={[styles.card, styles.cardSurface]}>
          <View style={styles.cardHeader}>
            <Feather name="star" size={14} color={colors.blue} />
            <Text style={[styles.cardHeaderText, { color: colors.blue, marginLeft: 4 }]}>
              AI STRUCTURED REPORT
            </Text>
          </View>
          <FieldRow label="Site" value={report.site} />
          <FieldRow label="Issue Type" value={report.issueType} />
          <FieldRow label="Component" value={report.component} />
          <FieldRow label="Urgency" urgency={report.urgency} isLast />
        </View>

        {/* Action items */}
        <View style={[styles.card, styles.cardSurface]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>ACTION ITEMS</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{items.length}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 14 }}>
            {items.map(item => (
              <ActionItemRow key={item.id} item={item} onToggle={toggleItem} />
            ))}
            <Pressable style={styles.addItemBtn}>
              <Feather name="plus" size={14} color={colors.textTertiary} />
              <Text style={styles.addItemText}>Add action item</Text>
            </Pressable>
          </View>
        </View>

        {/* Metadata row */}
        <View style={styles.metaRow}>
          {[
            { icon: 'clock', text: report.audioDuration },
            { icon: 'map-pin', text: report.site },
            { icon: 'calendar', text: report.timestampFull },
          ].map((m, i) => (
            <View key={i} style={styles.metaChip}>
              <Feather name={m.icon} size={12} color={colors.textTertiary} />
              <Text style={styles.metaText}>{m.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View style={styles.stickyBottom}>
        <Pressable
          style={[styles.submitBtn, submitting && styles.submitBtnLoading]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Report</Text>
          )}
        </Pressable>
        <Text style={styles.disclaimer}>
          AI-generated content. Review before submitting.
        </Text>
      </View>

      {/* Success overlay */}
      {submitted && (
        <Animated.View
          style={[styles.overlay, { opacity: overlayOpacity }]}
        >
          <Animated.View style={[styles.overlayCircleWrap, { transform: [{ scale: overlayScale }] }]}>
            <View style={styles.overlayGlow1} />
            <View style={styles.overlayGlow2} />
            <View style={styles.overlayCircle}>
              <Feather name="check" size={52} color={colors.green} />
            </View>
          </Animated.View>
          <Text style={styles.overlayText}>Report submitted!</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgPrimary },
  topNav: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  navTitle: {
    fontFamily: fonts.inter.semiBold,
    fontSize: 16,
    letterSpacing: -0.16,
    color: colors.navy,
  },
  submitBtnTop: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnTopText: {
    fontFamily: fonts.inter.bold,
    fontSize: 13,
    color: 'white',
  },
  aiRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.04)',
  },
  aiCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(16,185,129,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiText: {
    fontFamily: fonts.inter.medium,
    fontSize: 12,
    color: colors.green,
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  urgencyBanner: {
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  urgencyBannerText: {
    fontFamily: fonts.inter.bold,
    fontSize: 13,
    letterSpacing: 0.52,
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardSurface: { backgroundColor: colors.bgSurface },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  cardHeaderText: {
    fontFamily: fonts.inter.bold,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.48,
    textTransform: 'uppercase',
  },
  cardBody: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 10 },
  audioPlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.blueTint,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  audioPlayIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlayLabel: {
    flex: 1,
    fontFamily: fonts.inter.semiBold,
    fontSize: 12,
    color: colors.blue,
  },
  audioDuration: {
    fontFamily: fonts.mono.regular,
    fontSize: 11,
    color: colors.textTertiary,
  },
  transcriptText: {
    fontFamily: fonts.mono.regular,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 19.8,
  },
  countBadge: {
    backgroundColor: 'rgba(74,106,247,0.14)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontFamily: fonts.inter.bold,
    fontSize: 11,
    color: colors.blue,
  },
  addItemBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 12,
  },
  addItemText: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.textTertiary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 0,
    marginBottom: 4,
  },
  metaChip: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: fonts.mono.regular,
    fontSize: 10,
    color: colors.textTertiary,
  },
  stickyBottom: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  submitBtn: {
    width: '100%',
    backgroundColor: colors.navy,
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnLoading: { opacity: 0.5 },
  submitBtnText: {
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    color: 'white',
  },
  disclaimer: {
    fontFamily: fonts.inter.regular,
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.97)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayCircleWrap: {
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  overlayGlow1: {
    position: 'absolute',
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.14)',
  },
  overlayGlow2: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(16,185,129,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.18)',
  },
  overlayCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(16,185,129,0.14)',
    borderWidth: 2,
    borderColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    fontFamily: fonts.inter.bold,
    fontSize: 22,
    color: colors.navy,
  },
});
