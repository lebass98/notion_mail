import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const sources = [
  { name: 'Gmail', desc: '메일에서 일정 추출', color: 'bg-red-500' },
  { name: 'Notion', desc: '데이터베이스와 일정 동기화', color: 'bg-neutral-900 dark:bg-neutral-100' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-neutral-950">
      <View className="flex-1 gap-6 px-6 pt-10">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-neutral-900 dark:text-white">Mail Notion</Text>
          <Text className="text-base text-neutral-500">Gmail · Notion 연동 스케줄러</Text>
        </View>

        <View className="gap-3">
          {sources.map((source) => (
            <View
              key={source.name}
              className="flex-row items-center gap-4 rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
              <View className={`h-10 w-10 rounded-xl ${source.color}`} />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {source.name}
                </Text>
                <Text className="text-sm text-neutral-500">{source.desc}</Text>
              </View>
              <Text className="text-xs font-medium text-neutral-400">연결 예정</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
