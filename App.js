import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet, AppRegistry } from 'react-native'
import { Colors, FontSize } from './src/theme'

import HomeScreen from './src/screens/HomeScreen'
import DiaryScreen from './src/screens/DiaryScreen'
import AlbumScreen from './src/screens/AlbumScreen'
import CalendarScreen from './src/screens/CalendarScreen'
import ProfileScreen from './src/screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const tabs = [
  { name: 'Home', label: '首页', icon: '\u{2764}', component: HomeScreen },
  { name: 'Diary', label: '日记', icon: '\u{1F4DD}', component: DiaryScreen },
  { name: 'Album', label: '相册', icon: '\u{1F4F8}', component: AlbumScreen },
  { name: 'Calendar', label: '纪念日', icon: '\u{1F4C5}', component: CalendarScreen },
  { name: 'Profile', label: '我们', icon: '\u{1F46B}', component: ProfileScreen },
]

function TabIcon({ icon, focused }) {
  return (
    <View style={tabStyles.iconWrap}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{icon}</Text>
    </View>
  )
}

const tabStyles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center', top: 4 },
  icon: { fontSize: 22, opacity: 0.45 },
  iconActive: { opacity: 1 },
})

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F5F0', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#DCB5B5', marginBottom: 12 }}>出错了</Text>
          <Text style={{ fontSize: 13, color: '#999', textAlign: 'center' }}>{this.state.error.toString()}</Text>
        </View>
      )
    }
    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: Colors.white,
              borderTopColor: Colors.blueLight,
              borderTopWidth: StyleSheet.hairlineWidth,
              height: 85,
              paddingBottom: 20,
              paddingTop: 6,
            },
            tabBarActiveTintColor: Colors.pink,
            tabBarInactiveTintColor: Colors.textLight,
            tabBarLabelStyle: {
              fontSize: FontSize.xs,
              fontWeight: '500',
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab.Screen
              key={tab.name}
              name={tab.name}
              component={tab.component}
              options={{
                tabBarLabel: tab.label,
                tabBarIcon: ({ focused }) => <TabIcon icon={tab.icon} focused={focused} />,
              }}
            />
          ))}
        </Tab.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  )
}

AppRegistry.registerComponent('main', () => App)

if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root')
  if (rootTag) {
    AppRegistry.runApplication('main', { rootTag })
  }
}

export default App
