// MiniPreview.tsx
import { PURPLE } from '@/src/constants';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Spacer from './Spacer';
import { COLORS } from '@/src/colors';


type Props = {
    title?: string;
    items?: any[]
    onViewAll?: () => void;
    max? : number;
    renderItem?: (item: any) => React.ReactNode,
    icon?: React.ReactNode
}

export default function PreviewList({
  title = 'Items',
  items = [],
  onViewAll = () => {},
  max = 5,
  renderItem,
  icon
}: Props) {

  const preview = items.slice(0, max);
  return (
    <View style={s.card}>
      <TouchableOpacity onPress={onViewAll} style={s.header}>
        <View>
          {icon}
          <Spacer height={5}/>
          <Text style={s.title}>{title}</Text>
        </View>


        <Text style={s.link}>See all →</Text>
      </TouchableOpacity>

      <Spacer height={10}/>

      <FlatList
        data={preview}
        keyExtractor={(i, idx) => String(i?.id ?? idx)}
        renderItem={({ item }) => (
          <View style={s.container}>
            {renderItem?.(item)}
          </View>
        )
        }
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ListEmptyComponent={<Text style={s.empty}>No items</Text>}
      />
    </View>
  );
}

const s = StyleSheet.create({

  container: {
    padding: 12,
    marginRight: 12,
    // backgroundColor: "#ebe3edff",
    borderRadius: 10,
    justifyContent: "center",
    minWidth: 180,
    maxWidth: 220,        
  },

  card: { 
    backgroundColor: COLORS.favourite,
    padding: 10, 
    borderRadius: 8,
    width: '90%',
    height: 250,
    // maxHeight: 220,
    marginHorizontal: 'auto',
    shadowColor: 'rgba(47, 51, 54, 1)',
    shadowOffset: {width: 0.5, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingTop: 6
  },

  title: { fontWeight: '600', fontSize: 16, color: COLORS.text2},

  link: { 
    backgroundColor: "#efecfaff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    color: "#686967ff"
  },

  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 8, 
    borderTopWidth: 1, 
    borderColor: '#eee' 
  },

  empty: { padding: 8, color: '#888' },
});