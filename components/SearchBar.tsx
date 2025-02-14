import { StyleSheet, TextInput, View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type Props = {
  onSearch: (query: string) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    if (searchText.length > 0) {
      onSearch(searchText);  
      
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name='search-outline' size={20} color={Colors.lightGrey} />
        <TextInput
          placeholder='Tìm kiếm ngay ...'
          placeholderTextColor={Colors.lightGrey}
          style={styles.searchTxt}
          autoCapitalize='none'
          value={searchText}
          onChangeText={setSearchText}  
          returnKeyType='search'  
          onSubmitEditing={handleSearch}  
        />
      </View>


    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  searchBar: {
    backgroundColor: '#E4E4E4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  searchTxt: {
    fontSize: 14,
    flex: 1,
    color: Colors.darkGrey,
  },
  searchButton: {
    color: Colors.tint,  // Màu của nút Tìm kiếm
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});
