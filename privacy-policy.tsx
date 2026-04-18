import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Linking,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../contexts/ThemeContext';

interface Section {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  content: string | string[];
}

const SECTIONS: Section[] = [
  {
    id: 'intro',
    icon: 'sparkles-outline',
    title: 'Introduction',
    content:
      'Meizhi is an AI-powered meal planning app that helps you eat better every day. We generate personalized daily meal plans, send timely reminders, and learn your preferences over time. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.',
  },
  {
    id: 'ai',
    icon: 'sparkles-outline',
    title: 'AI & Automated Generation',
    content:
      'Meizhi is an AI-powered meal planning app. To generate personalized meal plans, we share your dietary preferences and restrictions with our AI service provider (currently Google Gemini). The AI service provider may change in the future to ensure the best user experience. The data shared is anonymized and does not include personally identifiable information such as your name, email, or location — we share only your generalized preferences such as dietary restrictions, allergies, cuisine preferences, and meal timing so the AI can generate appropriate meal suggestions. Meal suggestions are generated automatically and do not involve human review. These automated suggestions do not affect your legal rights. You can update your preferences at any time to influence future meal generation.',
  },
  {
    id: 'ai-providers',
    icon: 'hardware-chip-outline',
    title: 'AI Service Providers',
    content: [
      'Meizhi uses AI to generate personalized meal plans tailored to your dietary needs.',
      'Your data shared with our AI service is anonymized and does not include personally identifiable information such as your name, email, or location.',
      'We share only generalized preferences — such as dietary restrictions, allergies, cuisine preferences, and meal timing — so the AI can generate appropriate meal suggestions for you.',
      'The current AI service provider is Google Gemini. The provider may change in the future to ensure the best user experience.',
      'Our AI service provider processes this data solely to provide meal generation services on our behalf and is contractually bound to protect your data.',
    ],
  },
  {
    id: 'collect',
    icon: 'server-outline',
    title: 'Information We Collect',
    content: [
      'Email address — used for account creation and authentication.',
      'Display name — optional, personalizes your in-app experience.',
      'Dietary preferences — cuisines, restrictions, and allergies you choose.',
      'Push notification tokens — required to deliver meal reminders to your device.',
      'Meal plan data — AI-generated meals, cooking history, and favorites.',
      'Device timezone — used to schedule meal generation at 1:00 AM local time.',
    ],
  },
  {
    id: 'use',
    icon: 'bulb-outline',
    title: 'How We Use Your Information',
    content: [
      'Generate 12 personalized meals daily tailored to your preferences.',
      'Send meal reminder notifications 30 minutes before each meal time.',
      'Maintain your cooking history and streak statistics.',
      'Improve AI meal generation quality over time.',
      'Authenticate your account securely across sessions.',
    ],
  },
  {
    id: 'storage',
    icon: 'shield-checkmark-outline',
    title: 'Data Storage & Security',
    content:
      'All your data is stored securely in Supabase, a SOC 2 Type II certified infrastructure provider. Data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Meal images are stored in a private S3-compatible bucket with per-user access controls. We never sell or rent your personal data to third parties.',
  },
  {
    id: 'retention',
    icon: 'time-outline',
    title: 'Data Retention',
    content:
      'We retain your personal data for as long as your account is active. If you delete your account, all associated data is permanently removed within 24 hours. Anonymous usage analytics may be retained for up to 12 months.',
  },
  {
    id: 'third-party',
    icon: 'cube-outline',
    title: 'Third-Party Services',
    content: [
      'Google Sign-In — optional authentication method via OAuth 2.0.',
      'Apple Sign-In — optional authentication method via Sign in with Apple.',
      'Google Gemini — AI service powering meal generation. Your anonymized dietary preferences are processed by Gemini to generate personalized meal plans.',
      'Supabase — our primary database and authentication provider.',
      'Expo Push Notifications — cross-platform notification delivery.',
      'Pexels — ingredient image search for unrecognized ingredients.',
      'TheMealDB — ingredient image reference database.',
    ],
  },
  {
    id: 'notifications',
    icon: 'notifications-outline',
    title: 'Push Notifications',
    content:
      'Meizhi sends meal reminder notifications based on the timing preferences you configure in settings. Notifications are delivered 30 minutes before each scheduled meal. You can disable notifications at any time from the app settings or your device system settings. We use your Expo Push Token solely to deliver these reminders and never for marketing purposes.',
  },
  {
    id: 'cookies',
    icon: 'cookie-outline',
    title: 'Cookies',
    content:
      'We do not use cookies. Meizhi is a mobile app and does not store any cookies on your device.',
  },
  {
    id: 'disclaimer',
    icon: 'medkit-outline',
    title: 'Health Disclaimer',
    content:
      'Meizhi is a meal planning tool and is not a medical or clinical nutrition service. Meal suggestions are AI-generated based on your stated preferences and should not be treated as professional dietary or medical advice. Always consult a qualified healthcare provider for clinical nutritional guidance, especially if you have serious food allergies or medical dietary requirements.',
  },
  {
    id: 'age',
    icon: 'person-outline',
    title: 'Age Requirement',
    content:
      'Meizhi is intended for users aged 13 and older. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal data, please contact us and we will delete it promptly.',
  },
  {
    id: 'rights',
    icon: 'person-circle-outline',
    title: 'Your Rights & Data Deletion',
    content: [
      'Access: You can view all your data within the app at any time.',
      'Edit: Update your name, preferences, and meal timings from Profile settings.',
      'Delete: Use "Delete Account" in Profile to permanently erase all your data — including meals, preferences, cooking history, and your account — within seconds.',
      'Export: Contact us at mirkazuki.app@gmail.com to request a copy of your data.',
    ],
  },
  {
    id: 'updates',
    icon: 'refresh-outline',
    title: 'Policy Updates',
    content:
      'When we make significant changes to this policy, we will notify you via email or an in-app notification. Continued use of the app after changes constitutes acceptance of the updated policy.',
  },
  {
    id: 'contact',
    icon: 'mail-outline',
    title: 'Contact Us',
    content:
      'If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at mirkazuki.app@gmail.com. We aim to respond within 5 business days.',
  },
  {
    id: 'lawful-basis',
    icon: 'scale-outline',
    title: 'Lawful Basis for Processing (GDPR)',
    content: [
      'Contractual Necessity: Processing your email, preferences, and meal data is necessary to provide you with the meal planning service you requested.',
      'Legitimate Interests: We may process certain data for fraud prevention, security, and service improvement, which we believe is in your interest as a user.',
      'Consent: Push notification delivery requires your explicit consent, which you can withdraw at any time.',
      'Legal Obligation: We may retain certain data to comply with legal obligations.',
    ],
  },
  {
    id: 'withdraw-consent',
    icon: 'hand-right-outline',
    title: 'Right to Withdraw Consent',
    content:
      'Where we process your data based on consent, you have the right to withdraw that consent at any time. To withdraw consent for push notifications, please disable them in your device settings or within the app\'s notification preferences. Withdrawal of consent does not affect the lawfulness of processing before your withdrawal.',
  },
  {
    id: 'dpa-complaint',
    icon: 'shield-checkmark-outline',
    title: 'Right to Lodge a Complaint',
    content: [
      'If you are located in the European Economic Area (EEA) and believe we have infringed your data protection rights, you have the right to lodge a complaint with your local supervisory authority.',
      'UK: Information Commissioner\'s Office (ICO) – ico.org.uk',
      'France: Commission Nationale de l\'Informatique et des Libertés (CNIL)',
      'Germany: Bundesbeauftragter für den Datenschutz (BfDI)',
      'Spain: Agencia Española de Protección de Datos (AEPD)',
      'Find your local DPA at: ec.europa.eu/justice/article-29/structure/data-protection-authorities',
    ],
  },
  {
    id: 'international-transfers',
    icon: 'globe-outline',
    title: 'International Data Transfers',
    content: [
      'Meizhi operates globally. Your personal data may be transferred to and processed in countries outside the European Economic Area (EEA), including the United States.',
      'Our service providers (Supabase, Google, Apple) operate servers in the US. When we transfer data internationally, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) approved by the European Commission.',
      'We maintain data processing agreements with all third-party service providers to ensure your data is protected to GDPR standards.',
      'You may request details of the safeguards in place by contacting us at mirkazuki.app@gmail.com.',
    ],
  },
];

const HEADER_FULL_HEIGHT = 200;
const HEADER_COLLAPSED_HEIGHT = 60;
const SCROLL_THRESHOLD = 100;

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const scrollY = useRef(new Animated.Value(0)).current;

  const onScrollHandler = useRef(
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: scrollY } } }],
      { useNativeDriver: false }
    )
  ).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [HEADER_FULL_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const expandedOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD * 0.6],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const collapsedOpacity = scrollY.interpolate({
    inputRange: [SCROLL_THRESHOLD * 0.5, SCROLL_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const iconScale = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerPaddingBottom = scrollY.interpolate({
    inputRange: [0, SCROLL_THRESHOLD],
    outputRange: [24, 0],
    extrapolate: 'clamp',
  });

  const s = makeStyles(colors, isDark, insets);

  const headerGradient: [string, string] = isDark
    ? [colors.primary + 'CC', colors.primary + '66']
    : [colors.primary, colors.primary + 'BB'];

  return (
    <View style={s.root}>
      {/* Collapsing Header */}
      <Animated.View style={[s.headerWrapper, { height: Animated.add(headerHeight, insets.top) }]}>
        <LinearGradient colors={headerGradient} style={StyleSheet.absoluteFill} />
        <View style={[s.deco, { width: 200, height: 200, top: -70, right: -50, opacity: 0.10 }]} />
        <View style={[s.deco, { width: 90,  height: 90,  top: 30,  right: 90,  opacity: 0.07 }]} />

        <View style={[s.headerTop, { paddingTop: insets.top + 10 }]}>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); router.back(); }}
            style={s.backBtn}
            hitSlop={10}
          >
            <Ionicons name="chevron-back" size={22} color="#FFF" />
          </Pressable>

          <Animated.Text style={[s.collapsedTitle, { opacity: collapsedOpacity }]}>
            Privacy Policy
          </Animated.Text>

          <View style={{ width: 36 }} />
        </View>

        <Animated.View
          style={[
            s.expandedContent,
            { opacity: expandedOpacity, paddingBottom: headerPaddingBottom },
          ]}
        >
          <Animated.View
            style={[s.headerIconWrap, { transform: [{ scale: iconScale }] }]}
          >
            <Ionicons name="lock-closed" size={28} color="#FFF" />
          </Animated.View>
          <Text style={s.headerTitle}>Privacy Policy</Text>
          <Text style={s.headerSubtitle}>Meizhi · Last updated April 2026</Text>
        </Animated.View>
      </Animated.View>

      {/* Scroll Content */}
      <Animated.ScrollView
        style={s.scrollView}
        contentContainerStyle={[
          s.scrollContent,
          { paddingTop: HEADER_FULL_HEIGHT + insets.top + 12 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
      >
        {/* Intro banner */}
        <View style={[s.introBanner, { borderColor: colors.primary + '30', backgroundColor: colors.primary + '0C' }]}>
          <Ionicons name="lock-closed" size={18} color={colors.primary} />
          <Text style={[s.introBannerText, { color: colors.textSecondary }]}>
            We respect your privacy. Your data is encrypted, never sold, and always under your control.
          </Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            index={index}
            colors={colors}
            isDark={isDark}
          />
        ))}

        {/* Contact CTA */}
        <Pressable
          style={({ pressed }) => [
            s.contactCta,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => Linking.openURL('mailto:mirkazuki.app@gmail.com')}
        >
          <Ionicons name="mail" size={20} color="#FFF" />
          <Text style={s.contactCtaText}>mirkazuki.app@gmail.com</Text>
          <Ionicons name="open-outline" size={16} color="rgba(255,255,255,0.7)" />
        </Pressable>

        {/* Footer note */}
        <Text style={[s.footerNote, { color: colors.textMuted }]}>
          By using Meizhi you agree to this Privacy Policy.{'\n'}
          We may update this policy from time to time.
        </Text>
      </Animated.ScrollView>
    </View>
  );
}

// ── Section Card ─────────────────────────────────────────────────────────────
interface SectionCardProps {
  section: Section;
  index: number;
  colors: any;
  isDark: boolean;
}

function SectionCard({ section, index, colors, isDark }: SectionCardProps) {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    const delay = index * 55;
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 340, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 110, friction: 9, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const shadow = Platform.select({
    ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDark ? 0.25 : 0.07, shadowRadius: 8 },
    android: { elevation: 2 },
  });

  const isStringContent = typeof section.content === 'string';

  return (
    <Animated.View
      style={[
        styles.sectionCard,
        { backgroundColor: colors.surface, borderColor: isDark ? colors.border : 'transparent' },
        shadow,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconWrap, { backgroundColor: colors.primary + '18' }]}>
          <Ionicons name={section.icon} size={18} color={colors.primary} />
        </View>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          {section.title}
        </Text>
      </View>

      {/* Content */}
      {isStringContent ? (
        <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
          {section.content as string}
        </Text>
      ) : (
        <View style={styles.bulletList}>
          {(section.content as string[]).map((item, i) => (
            <View key={i} style={styles.bulletItem}>
              <View style={[styles.bulletDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
function makeStyles(colors: any, isDark: boolean, insets: any) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },

    // Collapsing header
    headerWrapper: {
      position: 'absolute',
      top: 0, left: 0, right: 0,
      zIndex: 10,
      overflow: 'hidden',
    },
    deco: {
      position: 'absolute',
      borderRadius: 999,
      backgroundColor: '#FFF',
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0,0,0,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    collapsedTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: '#FFF',
      letterSpacing: -0.2,
    },
    expandedContent: {
      alignItems: 'center',
      gap: 8,
      paddingTop: 10,
    },
    headerIconWrap: {
      width: 60,
      height: 60,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.22)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: '#FFF',
      letterSpacing: -0.4,
    },
    headerSubtitle: {
      fontSize: 13,
      fontWeight: '500',
      color: 'rgba(255,255,255,0.72)',
    },

    // Scroll
    scrollView: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 48,
      gap: 12,
    },

    // Intro banner
    introBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      marginBottom: 4,
    },
    introBannerText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: '500',
    },

    // Contact CTA
    contactCta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 16,
      borderRadius: 16,
      marginTop: 4,
      backgroundColor: colors.primary,
    },
    contactCtaText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFF',
    },

    // Footer note
    footerNote: {
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
      marginTop: 8,
      marginBottom: 8,
    },
  });
}

// Static styles shared by SectionCard
const styles = StyleSheet.create({
  sectionCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  bulletList: { gap: 10 },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
});
