import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { supabase, supabaseConfigured } from '../lib/supabase';

export default function HistoryScreen() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(supabaseConfigured);
  const [error, setError] = useState('');

  useEffect(() => {
    if (supabaseConfigured) {
      loadHistory();
    }
  }, []);

  async function loadHistory() {
    try {
      const { data, error: queryError } = await supabase
        .from('analysis_history')
        .select()
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      setRows(data ?? []);
    } catch (err) {
      setError(err.message || 'Unable to load history.');
    } finally {
      setLoading(false);
    }
  }

  if (!supabaseConfigured) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>History is not configured yet</Text>
        <Text style={styles.message}>
          Add EXPO_PUBLIC_SUPABASE_URL and
          EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env, then restart Expo.
        </Text>
      </View>
    );
  }

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Could not load history</Text>
        <Text style={styles.message}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={rows}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text style={styles.empty}>No saved analyses yet.</Text>
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.objects}>{item.objects}</Text>
          <Text style={styles.context}>{item.context}</Text>
          <Text style={styles.recommendations}>{item.recommendations}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F7FB',
  },
  title: {
    color: '#2E5BBA',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  list: {
    padding: 16,
    backgroundColor: '#F5F7FB',
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    padding: 14,
  },
  objects: {
    color: '#111',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  context: {
    color: '#333',
    marginBottom: 8,
  },
  recommendations: {
    color: '#555',
  },
  empty: {
    color: '#555',
    marginTop: 40,
    textAlign: 'center',
  },
});
