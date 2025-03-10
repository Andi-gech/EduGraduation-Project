
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalculateGpa } from '../../../../../utils/GradeCalculator';
import Header from '../../../../../Components/Header';
import Input from '../../../../../Components/Input';
import { useColorScheme } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function GradeCalculator() {
  const colorScheme = useColorScheme();
  const [courses, setCourses] = useState([]);
  const [mark, setMark] = useState('');
  const [creditHr, setCreditHr] = useState('');
  const accentColor = colorScheme === 'dark' ? '#f59e0b' : '#3b82f6';
  const gradientColors = colorScheme === 'dark' ? ['#09090b', '#18181b'] : ['#f8fafc', '#ffffff'];

  const handleAddCourse = () => {
    if (!mark || !creditHr) return;
    const newCourse = { 
      mark: parseFloat(mark), 
      credithr: parseInt(creditHr) 
    };
    Keyboard.dismiss();
    setCourses([...courses, newCourse]);
    setMark('');
    setCreditHr('');
  };

  const handleClearAll = () => {
    Keyboard.dismiss();
    setCourses([]);
    setMark('');
    setCreditHr('');
  };

  const { gpa, grades } = CalculateGpa(courses);

  const getGradeColor = (grade) => {
    const gradeColors = {
        'A+': '#16a34a', 
        'A': '#10b981',  
        'A-': '#059669', 
        
        'B+': '#2563eb', 
        'B': '#3b82f6',  
        'B-': '#60a5fa', 

        'C+': '#f97316', 
        'C': '#f59e0b',  
        'C-': '#fbbf24', 

        'D+': '#dc2626', 
        'D': '#ef4444',  
        'D-': '#f87171', 

        'F': '#64748b'   
    };

    return gradeColors[grade] || '#64748b'; // Default to gray if grade not found
};


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={gradientColors}
        locations={[0.1, 0.9]}
        className="flex-1 px-5 pt-[20px]"
      >
     <Header name="Grade Calculator" accentColor={accentColor} />
        
        <Text 
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 text-center mt-4 mb-6"
        >
          Enter your course details
        </Text>

        <View className="space-y-4">
          <Input
            placeholder="Course Mark"
            value={mark}
            onchange={setMark}
            type={"numeric"}
            containerStyle={{
              backgroundColor: colorScheme === 'dark' ? 'rgba(39, 39, 42, 0.5)' : 'rgba(255, 255, 255, 0.7)',
              borderColor: accentColor,
            }}
          />
          
          <Input
            placeholder="Credit Hours"
            type={"numeric"}
            value={creditHr}
            onchange={setCreditHr}
            containerStyle={{
              backgroundColor: colorScheme === 'dark' ? 'rgba(39, 39, 42, 0.5)' : 'rgba(255, 255, 255, 0.7)',
              borderColor: accentColor,
            }}
          />

          <View
            from={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <TouchableOpacity 
              className="p-4 rounded-2xl flex-row items-center justify-center space-x-2"
              style={{
                backgroundColor: accentColor + '20',
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 16,
              }}
              onPress={handleAddCourse}
            >
              <AntDesign name="pluscircle" size={20} color={accentColor} />
              <Text className="font-bold text-lg" style={{ color: accentColor }}>
                Add Course
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View 
          className="my-4 p-4 rounded-2xl"
          style={{
            backgroundColor: colorScheme === 'dark' ? 'rgba(39, 39, 42, 0.5)' : 'rgba(255, 255, 255, 0.7)',
            shadowColor: accentColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
          }}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-zinc-600 dark:text-zinc-400 text-lg">Current GPA</Text>
              <Text className="text-3xl font-bold mt-1" style={{ color: accentColor }}>
                {gpa}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={handleClearAll}
              className="px-4 py-2 rounded-full"
              style={{ backgroundColor: accentColor + '20' }}
            >
              <Text className="font-semibold" style={{ color: accentColor }}>Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={courses}
          keyExtractor={(_, index) => index.toString()}
          className='mb-[60px] overflow-hidden'
          renderItem={({ item, index }) => (
            <View
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              className="mb-2 p-4 rounded-xl"
              style={{
                backgroundColor: colorScheme === 'dark' ? 'rgba(39, 39, 42, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                shadowColor: accentColor,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
              }}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-zinc-800 dark:text-zinc-200 font-medium">
                    Course {index + 1}
                  </Text>
                  <Text className="text-zinc-600 dark:text-zinc-400 text-sm">
                    {item.mark}% • {item.credithr} Credits
                  </Text>
                </View>
                
                <View className="px-3 py-1 rounded-full" 
                  style={{ backgroundColor: getGradeColor(grades[index]) + '20' }}>
                  <Text className="font-semibold" 
                        style={{ color: getGradeColor(grades[index]) }}>
                    {grades[index]}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}